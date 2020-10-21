// @ts-ignore
import { mockFirebase } from 'firestore-jest-mock'

import './firebaseConfig'

import connect from "@browserql/client"
import gql from "graphql-tag"
import resolve from '@browserql/resolved'
import enhanceSchema, { getName } from "@browserql/schema"
import connectFirestore from './connectFirestore'
import { DocumentNode } from 'graphql'

function prepareTest(schema: DocumentNode) {
  const { client, schema: finalSchema, queries, mutations } = connect(
    connectFirestore({ schema })
  )
  
  const resolved = resolve<any>(finalSchema)
  const enhanced = enhanceSchema(finalSchema)

  return { resolved, enhanced }
}

test('there should be the query resolvers', () => {
  const { resolved } = prepareTest(gql`
  type Project @firestore {
    title: String!
    id: ID!
  }
`)
  expect(resolved.Query).toHaveProperty('firestore_getOne_Project')
  expect(resolved.Query).toHaveProperty('firestore_paginate_Project')
  expect(resolved.Query).toHaveProperty('firestore_getById_Project')
});

test('there should be the query schemas', ()=> {
  const { enhanced } = prepareTest(gql`
  type Project @firestore {
    title: String!
    id: ID!
  }
`)
  const queries = enhanced.getQueries()
  expect(queries.find(q => getName(q) === 'firestore_getOne_Project')).not.toBeUndefined()
  expect(queries.find(q => getName(q) === 'firestore_paginate_Project')).not.toBeUndefined()
  expect(queries.find(q => getName(q) === 'firestore_getById_Project')).not.toBeUndefined()
})

test('it should accept collection custom name', ()=> {
  const { enhanced } = prepareTest(gql`
  type Fooooo @firestore(collection: "project") {
    title: String!
    id: ID!
  }
`)
})
