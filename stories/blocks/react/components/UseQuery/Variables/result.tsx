import { BrowserqlProvider, UseQuery } from '@browserql/react'
import React from 'react'
import gql from 'graphql-tag'

interface User {
  id: string
  name: string
}

const data = {
  users: [
    {
      id: '1',
      name: 'user1',
    },
    {
      id: '2',
      name: 'user2',
    },
    {
      id: '3',
      name: 'user3',
    },
  ],
}

const getUser = ({ id }: { id: User['id'] }) => {
  return data.users.find((user) => user.id === id)
}

const schema = gql`
  type Query {
    getUser(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
  }
`

const query = gql`
  query Query($id: ID!) {
    getUser(id: $id) {
      __typename
      id
      name
    }
  }
`

export default function View(props: { id: User['id'] }) {
  const { id } = props
  return (
    <BrowserqlProvider schema={schema} queries={{ getUser }}>
      <UseQuery
        query={query}
        variables={{ id }}
        renderError={(e) => <h5>{e.message}</h5>}
        renderLoading={<div>Loading</div>}
      >
        {({ getUser: user }) => (
          <p>
            User #{id} is named "{user.name}"
          </p>
        )}
      </UseQuery>
    </BrowserqlProvider>
  )
}
