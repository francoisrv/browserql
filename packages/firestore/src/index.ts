import type { Schemaql, SchemaqlFactory } from '@browserql/client'
import enhanceSchema, { getName, hasDirective } from '@browserql/schema'
import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'

import { DocumentNode } from 'graphql'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { paginate } from './queries'

const SCHEMA = gql`
  scalar JSON

  directive @firestore(collection: String) on OBJECT

  enum FirestoreWhereOperator {
    EQUALS
  }

  input FirestoreWhere {
    field: String!
    operator: FirestoreWhereOperator!
    value: JSON!
  }
`

export default function connectFirestore(options: Schemaql = {}): SchemaqlFactory {
  return function (schemaql: Schemaql) {
    const typeDefs: Array<DocumentNode | string> = []
    const nextTypeDefs: Array<DocumentNode | string> = [SCHEMA]

    if (options.schema) {
      typeDefs.push(options.schema)
    }
    if (schemaql.schema) {
      typeDefs.push(schemaql.schema)
    }

    const schema = enhanceSchema(mergeTypeDefs(typeDefs))

    const targetTypes = schema.getTypes().filter(type => hasDirective(type, 'firestore'))

    const queries: Schemaql['queries'] = {}

    targetTypes.forEach(type => {
      const name = getName(type)
      
      const getOne = `firestore_getOne_${name}`
      const getMany = `firestore_getMany_${name}`
      
      queries[getOne] = async (variables: any) => {
        // try {
        //   return await paginate(name);
        // }  catch (error) {
        //   console.log('mmmh.. error')
        //   return { title: 'h' }
        // }
        try { await paginate(name) } catch (error) {}
        return { title: '1234' }
      }
      queries[getMany] = async () => {
        return await paginate(name)
      }

      nextTypeDefs.push(gql`
        extend type Query {
          ${getOne}(where: [FirestoreWhere] id: ID): ${name}
          ${getMany}(where: [FirestoreWhere]): [${name}]!
        }
      `)
    })
    
    const scalars = {
      JSON: GraphQLJSON,
    }
    
    return { schema: mergeTypeDefs(nextTypeDefs), queries, scalars }
  }
}
