import gql from 'graphql-tag'
import connect from '@browserql/client'
import resolve from '@browserql/resolved'
import enhanceSchema from '@browserql/schemax'

import connectFirestore from '.'

import firebase from 'firebase'
// import 'firebase/auth'
import 'firebase/firestore'
// import 'firebase/app'

// Firebase Config
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_BASEURL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// firebase.analytics()
// firebase.auth()

const schema = gql`
  type Todo @firestore {
    title: String!
  }
`

const { client, schema: finalSchema, queries, mutations } = connect(
  { schema },
  connectFirestore()
)

const resolved = resolve<any>(finalSchema)

test('it should have a query resolver for getTodo', async () => {
  const response = await client.query(
    resolved.Query.firestorePaginate({
      collection: 'projects',
    })
  )
  console.log(response.data.firestorePaginate)
})
