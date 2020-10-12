// @ts-ignore

import './firebaseConfig'

import connect from "@browserql/client"
import gql from "graphql-tag"
import resolve from '@browserql/resolved'
import connectFirestore from "."
import enhanceSchema from "@browserql/schema"

const schema = gql`
  type Test @firestore {
    foo: String!
    id: ID!
  }
`

const { client, schema: finalSchema } = connect(
  connectFirestore({ schema })
)

const resolved = resolve<any>(finalSchema)

test('it should have a query resolver for getTest', async () => {
  const response = await client.query(
    resolved.Query.firestore_getMany_Test({
    })
  )
  expect(response.data).toHaveProperty('firestore_getMany_Test')
  console.log(response.data.firestore_getMany_Test)
  expect(Array.isArray(response.data.firestore_getMany_Test)).toBe(true)
})
