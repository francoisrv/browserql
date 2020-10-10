import { Schemaql, SchemaqlFactory } from '@browserql/client'
import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import enhanceSchema from '@browserql/schemax'

export default function connectFirestore(options: Schemaql = {}): SchemaqlFactory {
  return function () {
    const db = firebase.firestore()

    const schema = enhanceSchema(gql`
      scalar JSON

      directive @firestore(collection: String) on OBJECT

      type FirestoreResponse {
        data: JSON
      }

      enum FirestoreWhereOperator {
        EQUALS
      }

      input FirestoreWhere {
        field: String!
        operator: FirestoreWhereOperator!
        value: JSON!
      }

      type Query {
        firestorePaginate(collection: String!, where: FirestoreWhere): JSON
      }
    `)

    if (options.schema) {
      schema.extend(options.schema)
    }
    
    const queries = {
      async firestorePaginate({ collection: collectionName, where }: any) {
        const collection = db.collection(collectionName)
        const querySnapshot = await collection.get()
        const docs: any[] = []
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() })
        })
        return docs
      },
    }
    const scalars = {
      JSON: GraphQLJSON,
    }
    return { schema: schema.get(), queries, scalars }
  }
}
