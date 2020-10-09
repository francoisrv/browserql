import { ConnectMiddleware } from '@browserql/client'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export function connectFirestore(): ConnectMiddleware {
  return function (document: DocumentNode) {
    const db = firebase.firestore()

    const schema = gql`
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
    `
    const queries = {
      async firestorePaginate({ collection: collectionName }: any) {
        const collection = db.collection(collectionName)
        const querySnapshot = await collection.get()
        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() })
        })
        return docs
      },
    }
    const scalars = {
      JSON: GraphQLJSON,
    }
    return { schema, queries, scalars }
  }
}
