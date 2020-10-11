import { Schemaql, SchemaqlFactory } from '@browserql/client'
import enhanceSchema, { getName, hasDirective } from '@browserql/schema'
import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default function connectFirestore(options: Schemaql = {}): SchemaqlFactory {
  return function (schemaql: Schemaql) {
    const db = firebase.firestore()

    const baseSchema = enhanceSchema(gql`
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
    `)

    let schema: ReturnType<typeof enhanceSchema> | null = null

    if (options.schema) {
      schema = enhanceSchema(options.schema)
      if (schemaql.schema) {
        schema.extend(schemaql.schema)
      }
    } else if (schemaql.schema) {
      schema = enhanceSchema(schemaql.schema)
    }

    if (!schema) {
      return {}
    }

    const x = schema

    const targetTypes = schema.getTypes().filter(type => hasDirective(type, 'firestore'))

    const queries: Schemaql['queries'] = {}

    targetTypes.forEach(type => {
      const name = getName(type)
      
      const getOne = `firestore_getOne_${name}`
      const getMany = `firestore_getMany_${name}`
      
      queries[getOne] = () => {}
      queries[getMany] = async () => {
        console.log('hello')
      }
      
      x.extend(gql`
        type Query {
          ${getOne}(where: [FirestoreWhere] id: ID): ${name}
          ${getMany}(where: [FirestoreWhere]): [${name}]!
        }
      `)
    })
    
    const scalars = {
      JSON: GraphQLJSON,
    }
    
    return { schema: baseSchema.get(), queries, scalars }
  }
}
