import * as React from 'react'
import gql from 'graphql-tag'
import { buildQuery, buildMutation } from '@browserql/operations'
import { print } from 'graphql'

import Code from '../components/Code'

export function BuildQueryExample() {
  const schema = gql`
    type User {
      id: ID!
      email: String!
    }

    extend type Query {
      getUser(userID: ID!): User
    }
  `
  return (
    <Code language="graphql" value={print(buildQuery(schema, 'getUser'))} />
  )
}

export function BuildMutationExample() {
  const schema = gql`
    type User {
      id: ID!
      email: String!
    }

    extend type Mutation {
      addUser(email: String!): User
    }
  `
  return (
    <Code language="graphql" value={print(buildMutation(schema, 'addUser'))} />
  )
}
