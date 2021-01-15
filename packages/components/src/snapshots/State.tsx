import * as React from 'react'
import { connectState } from '@browserql/state'
import gql from 'graphql-tag'
import { BrowserqlProvider } from '@browserql/react'
import GraphiQL from '@browserql/graphiql'

export function Example() {
  const schema = gql`
    type Query {
      getCounter: Int! @getState(initialValue: 1500)
    }
  `
  function App() {
    return (
      <div style={{ height: 450 }}>
        <GraphiQL
          graphiqlProps={{
            query: `
# Our schema:
# type Query {
#   getCounter: Int @getState(initialValue: 1500)
# }

# Note the use of @getState(initialValue: 1500)
# This gives us the initial value (this is optional)

# Use this query to get the counter
query GetCounter {
  getCounter
}

# Use this mutation to change the value returned by query getCounter
mutation SetCounter(
  $query: StateQuery!
  $variables: JSON
  $to: JSON!
) {
  setState(
    query: $query
    to: $to
    variables: $variables
  )
}`,
            response: JSON.stringify(
              {
                data: {
                  getCounter: 1500,
                },
                loading: false,
                networkStatus: 7,
                stale: false,
              },
              null,
              2
            ),
            variables: JSON.stringify(
              {
                query: 'getCounter',
                to: 1000,
              },
              null,
              2
            ),
          }}
        />
      </div>
    )
  }
  return (
    <BrowserqlProvider schema={schema} extensions={[connectState()]}>
      <App />
    </BrowserqlProvider>
  )
}
