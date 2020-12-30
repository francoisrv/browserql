import * as React from 'react'
import { gql, useQuery } from '@apollo/client'

import { BrowserqlProvider, UseQuery } from '@browserql/react'
import { buildQuery } from '@browserql/operations'

export function SandboxMainExample() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }
  `

  const queries = {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  }

  function SayHello({ to }: { to: string }) {
    const { data, loading, error } = useQuery(buildQuery(schema, 'sayHello'), {
      variables: { to },
    })
    if (error) return <div>{error.message}</div>
    if (loading) return <div>Loading...</div>
    return <p>{data.sayHello}</p>
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <SayHello to="everybody" />
    </BrowserqlProvider>
  )
}

export function QueryExample() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }
  `

  const queries = {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  }

  function SayHello({ to }: { to: string }) {
    const { data, loading, error } = useQuery(buildQuery(schema, 'sayHello'), {
      variables: { to },
    })
    if (error) return <div>{error.message}</div>
    if (loading) return <div>Loading...</div>
    return <p>{data.sayHello}</p>
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <SayHello to="everybody" />
    </BrowserqlProvider>
  )
}
