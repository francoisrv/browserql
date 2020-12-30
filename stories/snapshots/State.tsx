import * as React from 'react'
import { buildState } from '@browserql/state'
import gql from 'graphql-tag'

export function Example() {
  const schema = gql`
    type State @state {
      counter: Int!
      darkMode: Boolean!
      message: String!
      selectedUser: User!
      userNetwork: [User!]
    }

    type User {
      id: ID!
    }
  `
  const { context } = buildState(schema)
  console.log(context.ql.get('State.counter'))
  return <div>Hello</div>
}
