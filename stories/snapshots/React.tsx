import * as React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { BrowserqlProvider } from '@browserql/react'
import { buildQuery } from '@browserql/operations'

export function SandboxMainExample() {
  const schema = gql`
    extend type Query {
      sayHello(to: String!): String!
    }
  `

  const queries = {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  }

  function SayHello({ to }: { to: string }) {
    const { data, loading } = useQuery(buildQuery(schema, 'sayHello'), {
      variables: { to },
    })
    if (loading) return <div>Loading...</div>
    return <p>{data.sayHello}</p>
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <SayHello to="everybody" />
    </BrowserqlProvider>
  )
}
