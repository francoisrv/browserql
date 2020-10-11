import gql from 'graphql-tag'
import connect from '@browserql/client'
import resolve from '@browserql/resolved'
import enhanceSchema, { getName } from '@browserql/schema'

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
const enhanced = enhanceSchema(finalSchema)

console.log(enhanced.print())

console.log(queries)

afterAll(() => {
  console.log('STOP')
  client.stop()
  // process.exit(0)
})

test('there should be the query resolvers', () => {
  expect(resolved.Query).toHaveProperty('firestore_getOne_Todo')
  expect(resolved.Query).toHaveProperty('firestore_getMany_Todo')
});

test('there should be the query schemas', ()=> {
  const queries = enhanced.getQueries()
  expect(queries.find(q => getName(q) === 'firestore_getOne_Todo')).not.toBeUndefined()
  expect(queries.find(q => getName(q) === 'firestore_getMany_Todo')).not.toBeUndefined()
})

test('it should have a query resolver for getTodo', async () => {
  const response = await client.query(
    resolved.Query.firestore_getOne_Todo({
      // collection: 'projects',
    })
  )
  console.log(response)
  // expect(response.data).toHaveProperty('firestorePaginate')
})
