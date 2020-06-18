import { Schema } from '@browserql/client'
import gql from 'graphql-tag'
import baseSchema from './schema'
import { FIND_QUERY, FIND_ONE_QUERY, FIND_BY_ID_QUERY, DELETE_QUERY, DELETE_ONE_QUERY } from './utils'
import buildWhere from './buildWhere'

export default function buildSchema(schema: Schema): void {
  schema.extend(baseSchema)

  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    schema.addTypeFields(`
    extend type ${ typeName } @firestore {
      id: ID!
    }
    `)
    schema.addInput(`
    input FirestoreWhere${ typeName } {
      ${ buildWhere(type, schema).join('\n  ') }
    }
    `)
    schema.addQuery(`
    extend type Query {
      ${ FIND_QUERY(typeName, 'Query') }(
        paging: FirestorePaging
        where: FirestoreWhere${ typeName }
      ): [${ typeName }!]! @default(value: [])

      ${ FIND_ONE_QUERY(typeName, 'Query') }(
        where: FirestoreWhere${ typeName }
      ): ${ typeName }

      ${ FIND_BY_ID_QUERY(typeName, 'Query') }(
        id: ID!
      ): ${ typeName }

      ${ DELETE_QUERY(typeName, 'Query') }(
        paging: FirestorePaging
        where: FirestoreWhere${ typeName }
      ): [${ typeName }!]! @default(value: [])

      ${ DELETE_ONE_QUERY(typeName, 'Query') }(
        where: FirestoreWhere${ typeName }
      ): ${ typeName }
    
    }
  `)
  schema.addQuery(`
    extend type Mutation {
      ${ FIND_QUERY(typeName, 'Mutation') }(
        paging: FirestorePaging
        where: FirestoreWhere${ typeName }
      ): [${ typeName }!]! @default(value: [])

      ${ FIND_ONE_QUERY(typeName, 'Mutation') }(
        where: FirestoreWhere${ typeName }
      ): ${ typeName }

      ${ FIND_BY_ID_QUERY(typeName, 'Mutation') }(
        id: ID!
      ): ${ typeName }
    
    }
  `)
  }
}
