import { ObjectValueNode, FieldDefinitionNode, ObjectTypeDefinitionNode } from 'graphql'
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

export function makeReturnTypeNonScalar(
  fields: any[],
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

export function makeReturnType(type: string, schema: Schema, tab = ''): string {
  const realType = type
    .replace(/!/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .trim()
  if (includes(primitives, realType)) {
    return ''
  }
  const scalars = schema.getScalars().map(Schema.getName)
  if (includes(scalars, realType)) {
    return ''
  }
  if (schema.getType(realType)) {
    const fields = schema.getTypeFields(realType)
    return makeReturnTypeNonScalar(fields, schema, tab).join('\n')
  }
  if (schema.getEnumeration(realType)) {
    return ''
  }
  throw new Error(`Could not make return type for: ${ type }`)
}

export function printTransaction(
  type: 'query' | 'mutation',
  field: FieldDefinitionNode,
  schema: Schema
): string {
  return `${ type } {
  ${ Schema.getName(field) } ${ makeReturnType(Schema.printType(field.type), schema, '  ') }
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
  const name = Schema.getName(field)
  if (typeof name === 'undefined') {
    throw new Error('Could not get name from field')
  }
  transaction.name = name
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
