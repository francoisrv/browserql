import GraphiQL from '@browserql/graphiql'
import { BrowserqlProvider } from '@browserql/react'
import * as React from 'react'
import gql from 'graphql-tag'

export function Example() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }

    type Mutation {
      sayByeTo(to: String!): String!
    }
  `

  const queries = {
    sayHello({ to }: { to: string }) {
      return `hello ${to}`
    },
  }

  const mutations = {
    sayByeTo({ to }: { to: string }) {
      return `bye ${to}`
    },
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries} mutations={mutations}>
      <div
        style={{
          position: 'relative',
          height: 700,
          lineHeight: '5px',
        }}
      >
        <GraphiQL
          graphiqlProps={{
            defaultQuery: '{ sayHello(to: "everybody") }',
            defaultSecondaryEditorOpen: true,
            headerEditorEnabled: true,
            response: `{
  "data": {
    "sayHello": "hello everybdoy"
  },
  "loading": false,
  "networkStatus": 7,
  "stale": false
}
            `,
          }}
        />
      </div>
    </BrowserqlProvider>
  )
}
