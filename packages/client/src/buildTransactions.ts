import { FieldDefinitionNode } from 'graphql'
import {includes} from 'lodash'
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
 * Fragment a type
 * @param fields [FieldDefinitionNode]
 * @param schema BrowserQL schema
 * @param tab string Indentation
 */
export function makeReturnTypeNonScalar(
  fields: FieldDefinitionNode[],
  schema: Schema,
  tab = '  '
): string[] {
  const lines: string[] = [
    '{'
  ]
  fields.forEach(field => {
    lines.push(`${ tab }  ${ Schema.getName(field) } ${ makeReturnType(Schema.printType(field.type), schema, `${ tab }  `) }`)
  })
  lines.push(`${ tab }}`)
  return lines
}

/**
 * Create a return type for a query/mutation
 * @param type string - The name of the type/fragment/enum/scalar
 * @param schema Schema - browserql schema
 * @param tab string - indentation
 */
export function makeReturnType(type: string, schema: Schema, tab = ''): string {
  // strip flags from type name if any
  const realType = type
    .replace(/!/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .trim()
  // If scalar (ie, String, Int, etc.)
  if (includes(primitives, realType)) {
    return ''
  }
  // If custom scalar
  const scalars = schema.getScalars().map(Schema.getName)
  if (includes(scalars, realType)) {
    return ''
  }
  // If type
  if (schema.getType(realType)) {
    const fields = schema.getTypeFields(realType)
    return makeReturnTypeNonScalar(fields, schema, tab).join('\n')
  }
  // If enumeration
  if (schema.getEnumeration(realType)) {
    return ''
  }
  // If fragment
  const f = schema.getFragment(realType)
  console.log({f})
  throw new Error(`Could not make return type for: ${ type }`)
}

export function printTransaction(
  type: 'query' | 'mutation',
  field: FieldDefinitionNode,
  schema: Schema
): string {
  return `${ type } {
  ${
    [
      Schema.getName(field),
      makeReturnType(Schema.printType(field.type), schema, '  ')
    ].join(' ')
  }
}`
}

export function printTransactionWithArguments(
  type: 'query' | 'mutation',
  field: FieldDefinitionNode,
  schema: Schema,
): string {
  const lines: string[] = [
    `${ type } ${ Schema.getName(field) } (`
  ]
  if (field.arguments) {
    field.arguments.forEach(arg => {
      lines.push(`  $${ Schema.getName(arg) }: ${ Schema.printType(arg.type) }`)
    })
  }
  lines.push(') {')
  lines.push(`  ${ Schema.getName(field) } (`)
  if (field.arguments) {
    field.arguments.forEach(arg => {
      lines.push(`    ${ Schema.getName(arg) }: $${ Schema.getName(arg) }`)
    })
  }
  lines.push(`  ) ${ makeReturnType(Schema.printType(field.type), schema) }`)
  lines.push('}')
  return lines.join('\n')
}

export function buildTransaction(
  field: FieldDefinitionNode,
  transactionType: 'query' | 'mutation',
  schema: Schema
): Transaction {
  const transaction: Partial<Transaction> = {}
  transaction.name = Schema.getName(field)
  transaction.type = transactionType
  if (
    ('arguments' in field) && 
    Array.isArray(field.arguments) &&
    field.arguments.length
  ) {
    transaction.source = printTransactionWithArguments(
      transactionType,
      field,
      schema,
    )
  } else {
    transaction.source = printTransaction(
      transactionType,
      field,
      schema
    )
  }
  transaction.node = gql(transaction.source)
  // @ts-ignore name is not undefined
  return transaction
}

export default function buildTransactions(schema: Schema): Transaction[] {
  const transactions: Transaction[] = []

  const queries = schema.getQueries()

  for (const query of queries) {
    transactions.push(buildTransaction(query, 'query', schema))
  }

  const mutations = schema.getMutations()

  for (const mutation of mutations) {
    transactions.push(buildTransaction(mutation, 'mutation', schema))
  }

  return transactions
}
