// @ts-ignore

import './firebaseConfig'

import connect from '@browserql/client'
import gql from 'graphql-tag'
import resolve from '@browserql/resolved'
import connectFirestore from './connectFirestore'

const schema = gql`
  type Test @firestore {
    foo: String!
    id: ID!
  }
`

const { client, schema: finalSchema } = connect(connectFirestore({ schema }))

const resolved = resolve<any>(finalSchema)

test('it should have a query resolver for getTest', async () => {
  const response = await client.query(
    resolved.Query.firestore_paginate_Test({})
  )
  expect(response.data).toHaveProperty('firestore_paginate_Test')
  console.log(response.data.firestore_paginate_Test)
  expect(Array.isArray(response.data.firestore_paginate_Test)).toBe(true)
})
