import React from 'react'
import SchemaComposer from '@browserql/schema-composer'
import gql from 'graphql-tag'

export default function TryClient() {
  return (
    <div>
      <SchemaComposer
        schema={gql`
          type Query {
            getUser(id: ID!): User
          }

          type User {
            id: ID!
            email: EmailAddress!
          }

          scalar EmailAddress
        `}
        onChange={() => {}}
      />
    </div>
  )
}
