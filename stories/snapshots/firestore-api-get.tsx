import * as React from 'react'
import MockFirebase from 'mock-cloud-firestore'
import { build } from '@browserql/firestore'
import gql from 'graphql-tag'
import connect from '@browserql/client'
import { connect as connectFirestoreql, get } from '@browserql/firestore'
import connectScalars from '@browserql/scalars'
import { print } from 'graphql'
import { useQuery } from '@apollo/client'
import Code from '../components/Code'

// const schema = gql`
//   type Todo @firestore {
//     name: String!
//   }
// `

// const fixtureData = {
//   __collection__: {
//     users: {
//       __doc__: {
//         user_a: {
//           age: 15,
//           username: 'user_a',
//         },
//       },
//     },
//   },
// }
// const firebase = new MockFirebase(fixtureData)

// const { client } = connect(
//   connectFirestoreql(firebase.firestore, schema),
//   connectScalars()
// )

// function View() {
//   const { data, loading, error } = useQuery(get('Todo'))

//   if (error) {
//     return <div>{error.message}</div>
//   }

//   if (loading) {
//     return <div>Loading</div>
//   }

//   return <div>{data.firestore_get_Todo}</div>
// }

export default function FirestoreApiGet() {
  return <Code language="text" value="MISSING TEST" />
}
