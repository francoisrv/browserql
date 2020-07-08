import { FieldDefinitionNode, FragmentDefinitionNode, TypeNode, ArgumentNode, InputValueDefinitionNode } from 'graphql'
import {includes, compact} from 'lodash'
import gql from 'graphql-tag'

import { Transaction } from './types'
import Schema from './Schema'

const primitives = [
  'String',
  'Int',
  'Float',
  'Boolean',
  'ID'
]

/**
 * Create a return type for a query/mutation
 * @param type string - The name of the type/fragment/enum/scalar
 * @param schema Schema - browserql schema
 * @param tab string - indentation
 */
export function makeReturnType(type: string, schema: Schema, tab = ''): { source: string, fragment?: FragmentDefinitionNode } {
  // strip flags from type name if any
  const realType = type
    .replace(/!/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .trim()
  // If scalar (ie, String, Int, etc.)
  if (includes(primitives, realType)) {
    return { source: '' }
  }
  // If custom scalar
  const scalars = schema.scalars.getScalars().map(Schema.getName)
  if (includes(scalars, realType)) {
    return { source: '' }
  }
  // If type
  if (schema.types.getType(realType)) {
    return {
      source: `{
    ...browserqlFragment_${ realType }
  }`,
      fragment: schema.fragments.getFragment(`browserqlFragment_${ realType }`)
    }
  }
  // If enumeration
  if (schema.enumerations.getEnumeration(realType)) {
    return { source: '' }
  }
  throw new Error(`Could not make return type for: ${ type }`)
}

export function makeTransactionSource(
  operationType: 'query' | 'mutation',
  name: string,
  args: Readonly<InputValueDefinitionNode[]>,
  kind: string,
  schema: Schema
) {
  const variables: string[] = []
  const params: string[] = []
  if (args.length) {
    variables.push('(')
    params.push('(')
    args.forEach(arg => {
      variables.push(`  $${ Schema.getName(arg) }: ${ Schema.printType(arg.type) }`)
      params.push(`    ${ Schema.getName(arg) }: $${ Schema.getName(arg) }`)
    })
    variables.push(')')
    params.push('  )')
  }
  const type = makeReturnType(kind, schema)
return `
${ operationType }${ variables.join('\n') } {
  ${ name }${ params.join('\n') } ${ type.source }
}
`
}

export function makeTransaction(
  type: 'query' | 'mutation',
  field: FieldDefinitionNode,
  schema: Schema
): { source: string, fragment?: FragmentDefinitionNode } {
  const kind = makeReturnType(Schema.printType(field.type), schema, '  ')
  return {
    source: makeTransactionSource(
      type,
      Schema.getName(field),
      // @ts-ignore
      field.arguments || [],
      kind.source,
      schema
    ),
    fragment: kind.fragment
  }
}

export function buildTransaction(
  field: FieldDefinitionNode,
  transactionType: 'query' | 'mutation',
  schema: Schema
): Transaction {
  const name = Schema.getName(field) as string
  const type = transactionType
  const { source, fragment } = makeTransaction(transactionType, field, schema)
  const node = gql(source)
  return {
    name,
    type,
    source,
    node,
    fragments: compact([fragment])
  }
}

export default function buildTransactions(schema: Schema): Transaction[] {
  const transactions: Transaction[] = []

  const queries = schema.queries.getQueries()

  for (const query of queries) {
    transactions.push(buildTransaction(query, 'query', schema))
  }

  const mutations = schema.mutations.getMutations()

  for (const mutation of mutations) {
    transactions.push(buildTransaction(mutation, 'mutation', schema))
  }

  return transactions
}
