import * as React from 'react'
import { stateql, connectState } from '@browserql/state'
import gql from 'graphql-tag'
import { BrowserqlContext, BrowserqlProvider } from '@browserql/react'
import GraphiQL from '@browserql/graphiql'

export function Example() {
  const schema = gql`
    type Query {
      getCounter: Int
    }
  `
  function App() {
    return (
      <div style={{ height: 450 }}>
        <GraphiQL
          graphiqlProps={{
            query: `query GetCounter {
  getCounter
}

mutation SetCounter($query: StateQuery! $variables: JSON $to: JSON!) {
  setState(
    query: $query
    to: $to
    variables: $variables
  )
}`,
            response: JSON.stringify(
              {
                getCounter: 0,
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
    <BrowserqlProvider schema={schema} extensions={[connectState({ schema })]}>
      <App />
    </BrowserqlProvider>
  )
}
