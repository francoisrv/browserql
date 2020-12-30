import * as React from 'react'
import { gql, useQuery } from '@apollo/client'

import {
  BrowserqlProvider,
  UseQuery,
  UseMutation,
  withQuery,
} from '@browserql/react'
import { buildQuery, buildMutation } from '@browserql/operations'

console.log({ UseMutation })

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

  const SAY_HELLO = buildQuery(schema, 'sayHello')

  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <UseQuery query={SAY_HELLO} variables={{ to: 'everybody' }}>
        {(response) => <p>{response}</p>}
      </UseQuery>
    </BrowserqlProvider>
  )
}

export function MutationExample() {
  const schema = gql`
    type Mutation {
      sayHello(to: String!): String!
    }
  `

  const mutations = {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  }

  const SAY_HELLO = buildMutation(schema, 'sayHello')

  return (
    <BrowserqlProvider schema={schema} mutations={mutations}>
      <UseMutation mutation={SAY_HELLO} variables={{ to: 'everybody' }}>
        {(response) => <p>{response}</p>}
      </UseMutation>
    </BrowserqlProvider>
  )
}

export function WithQueryExample() {
  const schema = gql`
    type Query {
      sayHello(to: String!): String!
    }
  `
  function SayHello({ sayHello }) {
    if (sayHello.error) return <div>{sayHello.error.message}</div>

    if (sayHello.loading) return <div>Loading...</div>

    return <p>{sayHello.data}</p>
  }
  const Wrapped = withQuery(buildQuery(schema, 'sayHello'), {
    to: 'everybody',
  })(SayHello)
  return (
    <BrowserqlProvider
      schema={schema}
      queries={{
        sayHello({ to }) {
          return `Hello ${to}`
        },
      }}
    >
      <div style={{ padding: 32 }}>
        <Wrapped />
      </div>
    </BrowserqlProvider>
  )
}
