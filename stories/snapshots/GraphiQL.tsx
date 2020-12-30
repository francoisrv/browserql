import GraphiQL from '@browserql/graphiql'
import { BrowserqlProvider } from '@browserql/react'
import * as React from 'react'
import gql from 'graphql-tag'

export function Example() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }

    extend type Query {
      sayByeTo(to: String!): String!
    }
  `

  const queries = {
    sayHello({ to }: { to: string }) {},
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <div
        style={{
          position: 'relative',
          height: 200,
        }}
      >
        <GraphiQL buttonStyle={{ position: 'absolute' }} />
      </div>
    </BrowserqlProvider>
  )
}
