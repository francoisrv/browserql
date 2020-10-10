import { Schemaql, SchemaqlFactory } from '@browserql/client'
import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import enhanceSchema, { getName, hasDirective } from '@browserql/schemax'

export default function connectFirestore(options: Schemaql = {}): SchemaqlFactory {
  return function (schemaql: Schemaql) {
    console.log({schemaql})
    const db = firebase.firestore()

    const schema = enhanceSchema(gql`
      scalar JSON

      directive @firestore(collection: String) on OBJECT

      type FirestoreResponse {
        data: JSON
      }

      enum FirestoreWhereOperator {ya
        EQUALS
      }

      input FirestoreWhere {
        field: String!
        operator: FirestoreWhereOperator!
        value: JSON!
      }
    `)

    if (schemaql.schema) {
      schema.extend(schemaql.schema)
    }

    if (options.schema) {
      schema.extend(options.schema)
    }

    const targetTypes = schema.getTypes().filter(type => hasDirective(type, 'firestore'))

    console.log('targetTypes', targetTypes)
    
    const queries: Schemaql['queries'] = {}

    targetTypes.forEach(type => {
      const name = getName(type)
      
      const getOne = `firestore_getOne_${name}`
      const getMany = `firestore_getMany_${name}`
      
      queries[getOne] = () => {}
      queries[getMany] = () => {}
      
      schema.extend(gql`
        type Query {
          ${getOne}(where: [FirestoreWhere] id: ID): ${name}
          ${getMany}(where: [FirestoreWhere]): [${name}]!
        }
      `)
    })
    
    const scalars = {
      JSON: GraphQLJSON,
    }
    
    return { schema: schema.get(), queries, scalars }
  }
}
