// @ts-ignore
import { mockFirebase } from 'firestore-jest-mock'

import './firebaseConfig'

import connect from "@browserql/client"
import gql from "graphql-tag"
import resolve from '@browserql/resolved'
import connectFirestore from "."
import enhanceSchema, { getName } from "@browserql/schema"

const schema = gql`
  type Project @firestore {
    title: String!
    id: ID!
  }
`

const { client, schema: finalSchema, queries, mutations } = connect(
  connectFirestore({ schema })
)

const resolved = resolve<any>(finalSchema)
const enhanced = enhanceSchema(finalSchema)

test('there should be the query resolvers', () => {
  expect(resolved.Query).toHaveProperty('firestore_getOne_Project')
  expect(resolved.Query).toHaveProperty('firestore_getMany_Project')
  expect(resolved.Query).toHaveProperty('firestore_getById_Project')
});

test('there should be the query schemas', ()=> {
  const queries = enhanced.getQueries()
  expect(queries.find(q => getName(q) === 'firestore_getOne_Project')).not.toBeUndefined()
  expect(queries.find(q => getName(q) === 'firestore_getMany_Project')).not.toBeUndefined()
  expect(queries.find(q => getName(q) === 'firestore_getById_Project')).not.toBeUndefined()
})
