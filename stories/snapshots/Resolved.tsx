import * as React from 'react'
import gql from 'graphql-tag'
import resolve from '@browserql/resolved'
import { print } from 'graphql'
import Code from '../components/Code'

export function Example() {
  const schema = gql`
    type User {
      id: ID!
      email: String!
    }

    extend type Query {
      getUser(userID: ID!): User
    }
  `
  const {
    Query: { getUser },
  } = resolve(schema)
  const op = getUser({ userID: 1234 })
  return (
    <>
      <Code language="graphql" value={print(op.query)} />
      <Code language="json" value={JSON.stringify(op.variables, null, 2)} />
    </>
  )
}

export function ExampleMutation() {
  const schema = gql`
    type User {
      id: ID!
      email: String!
    }

    extend type Mutation {
      addUser(email: String!): User
    }
  `
  const {
    Mutation: { addUser },
  } = resolve(schema)
  const op = addUser({ email: 'foo@bar.com' })
  return (
    <>
      <Code language="graphql" value={print(op.mutation)} />
      <Code language="json" value={JSON.stringify(op.variables, null, 2)} />
    </>
  )
}
