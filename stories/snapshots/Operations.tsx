import * as React from 'react'
import gql from 'graphql-tag'
import {
  buildQuery,
  buildMutation,
  buildCompoundQuery,
  buildOperationString,
} from '@browserql/operations'
import { print } from 'graphql'

import Code from '../components/Code'

export function BuildQueryExample() {
  const schema = gql`
    type User {
      id: ID!
      email: String!
      isVerified: Boolean!
    }

    type Query {
      getUser(userID: ID!, isVerified: Boolean = false): User
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

export function BuildCompoundQueryExample() {
  const schema = gql`
    type Query {
      getUserById(id: ID!): User!
      getUserTags(userId: ID!): [Tag]!
      getUserBadges(userId: ID!): [Badge]!
    }

    type User {
      id: ID!
      email: String!
    }

    type Tag {
      id: ID!
      userId: ID!
      title: String!
    }

    type Badge {
      id: ID!
      userId: ID!
      title: String!
    }
  `
  return (
    <Code
      language="graphql"
      value={print(
        buildCompoundQuery(
          schema,
          { userId: 'ID!' },
          ['getUserById', { id: 'userId' }],
          'getUserTags',
          'getUserBadges'
        )
      )}
    />
  )
}

export function BuildOperationString() {
  const schema = gql`
    type User {
      id: ID!
      email: String!
      isVerified: Boolean!
      getUser(userID: ID!, isVerified: Boolean = false): Settings
    }

    type Settings {
      id: ID!
      userID: ID!
    }
  `
  return (
    <Code
      language="graphql"
      value={buildOperationString(schema, 'User.getUser')}
    />
  )
}
