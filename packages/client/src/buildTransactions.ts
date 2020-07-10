import { FieldDefinitionNode, FragmentDefinitionNode, TypeNode, ArgumentNode, InputValueDefinitionNode, SelectionNode, InlineFragmentNode } from 'graphql'
import {includes, compact, isArray, isUndefined, uniqBy} from 'lodash'
import gql from 'graphql-tag'

import { Transaction } from './types'
import Schema from './Schema'
import SchemaKinds from './Schema.kinds'
import SchemaFragments from './Schema.fragments'

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
export function makeReturnType(type: string, schema: Schema, tab = ''): string {
  // strip flags from type name if any
  const realType = SchemaKinds.printEndKind(type)
  // If scalar (ie, String, Int, etc.)
  if (includes(primitives, realType)) {
    return ''
  }
  // If custom scalar
  const scalars = schema.scalars.getScalars().map(Schema.getName)
  if (includes(scalars, realType)) {
    return ''
  }
  // If type
  if (schema.types.getType(realType)) {
    return `{
    ...browserqlFragment_${ realType }
  }`
  }
  // If enumeration
  if (schema.enumerations.getEnumeration(realType)) {
    return ''
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
      variables.push(`  $${ Schema.getName(arg) }: ${ SchemaKinds.printKind(arg.type) }`)
      params.push(`    ${ Schema.getName(arg) }: $${ Schema.getName(arg) }`)
    })
    variables.push(')')
    params.push('  )')
  }
  const type = makeReturnType(kind, schema)
return `
${ operationType }${ variables.join('\n') } {
  ${ name }${ params.join('\n') } ${ type }
}
`
}

export function getNestedSelections(
  selection: SelectionNode | InlineFragmentNode,
  schema: Schema
): FragmentDefinitionNode[] {
  const fragments: FragmentDefinitionNode[] = []
  if ('selectionSet' in selection && !isUndefined(selection.selectionSet)) {
    for (const subSelection of selection.selectionSet.selections) {
      const name = Schema.getName(subSelection)
      const fragment = schema.fragments.getFragment(name)
      if (fragment) {
        fragments.push(fragment)
        fragments.push(...getNestedFragments(fragment, schema))
      }
    }
  }
  return fragments
}

export function getNestedFragments(
  fragment: FragmentDefinitionNode,
  schema: Schema
): FragmentDefinitionNode[] {
  let fragments: FragmentDefinitionNode[] = [fragment]
  const { selectionSet: { selections } } = fragment
  for (const selection of selections) {
    fragments.push(...getNestedSelections(selection, schema))
  }
  fragments = uniqBy(fragments, Schema.getName)
  return fragments
}

export function getTransactionFragments(
  typeNode: TypeNode,
  schema: Schema
): FragmentDefinitionNode[] {
  const type = SchemaKinds.printEndKind(typeNode)
  if (schema.types.hasType(type)) {
    const fragment = schema.fragments.getFragment(`browserqlFragment_${ type }`)
    if (fragment) {
      return getNestedFragments(fragment, schema)
    }
  }
  return []
}

export function buildTransaction(
  field: FieldDefinitionNode,
  transactionType: 'query' | 'mutation',
  schema: Schema
): Transaction {
  const name = Schema.getName(field) as string
  const type = transactionType
  const args = 'arguments' in field && isArray(field.arguments) ? field.arguments : []
  const source = makeTransactionSource(
    transactionType,
    Schema.getName(field),
    args,
    SchemaKinds.printKind(field.type),
    schema
  )
  const node = gql(source)
  return {
    name,
    type,
    source,
    node,
    fragments: getTransactionFragments(field.type, schema)
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
