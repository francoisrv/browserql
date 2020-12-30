import * as React from 'react'
import gql from 'graphql-tag'
import resolve from '@browserql/resolved'
import { print } from 'graphql'
import Code from '../components/Code'

function Output({
  query,
  variables,
  isMutation,
}: {
  query: string
  variables: string
  isMutation?: boolean
}) {
  return (
    <div style={{ padding: 16, backgroundColor: '#ccc' }}>
      <h3
        style={{
          color: '#369',
          textShadow: '3px 3px 3px rgba(200, 100, 200, 0.5)',
        }}
      >
        {'{'}
      </h3>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <h3
          style={{
            width: 200,
            textAlign: 'center',
            color: '#369',
          }}
        >
          <code
            style={{
              borderBottom: '4px solid #369',
              paddingBottom: 20,
              textShadow: '3px 3px 3px rgba(200, 100, 200, 0.5)',
            }}
          >
            {isMutation ? 'mutation' : 'query'}:
          </code>
        </h3>
        <div style={{ flex: 1 }}>
          <Code language="graphql" value={query} />
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <h3 style={{ width: 200, textAlign: 'center', color: '#369' }}>
          <code
            style={{
              borderBottom: '4px solid #369',
              paddingBottom: 20,
              textShadow: '3px 3px 3px rgba(200, 100, 200, 0.5)',
            }}
          >
            variables:
          </code>
        </h3>
        <div style={{ flex: 1 }}>
          <Code language="json" value={variables} />
        </div>
      </div>
      <h3
        style={{
          color: '#369',
          textShadow: '3px 3px 3px rgba(200, 100, 200, 0.5)',
        }}
      >
        {'}'}
      </h3>
    </div>
  )
}

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
    <Output
      query={print(op.query)}
      variables={JSON.stringify(op.variables, null, 2)}
    />
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
    <Output
      query={print(op.mutation)}
      variables={JSON.stringify(op.variables, null, 2)}
      isMutation
    />
  )
}
