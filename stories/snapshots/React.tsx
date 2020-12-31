import * as React from 'react'
import { gql, useQuery } from '@apollo/client'

import {
  BrowserqlProvider,
  UseQuery,
  UseMutation,
  withQuery,
  BrowserqlContext,
  BrowserqlProviderProps,
} from '@browserql/react'
import { buildQuery, buildMutation } from '@browserql/operations'
import connect from '@browserql/client'
import { JSONResolver } from 'graphql-scalars'

console.log({ UseQuery })

const sayHelloExample = {
  schema: gql`
    type Query {
      sayHello(to: String!): String!
    }
  `,
  queries: {
    sayHello({ to }: { to: string }) {
      return `Hello ${to}`
    },
  },
}

function ProviderTemplate(props: BrowserqlProviderProps) {
  function SayHello({ to }: { to: string }) {
    const ctx = React.useContext(BrowserqlContext)
    const { data, loading, error } = useQuery(
      buildQuery(ctx.schema, 'sayHello'),
      {
        variables: { to },
      }
    )
    if (error) return <div>{error.message}</div>
    if (loading) return <div>Loading...</div>
    return <p>{data.sayHello}</p>
  }

  return (
    <BrowserqlProvider {...props}>
      <div style={{ padding: 24 }}>
        <SayHello to="everybody" />
      </div>
    </BrowserqlProvider>
  )
}

export function SandboxMainExample() {
  return (
    <ProviderTemplate
      schema={sayHelloExample.schema}
      queries={sayHelloExample.queries}
    />
  )
}

export function ProviderClientProp() {
  const client = connect(sayHelloExample)
  return <ProviderTemplate client={client} />
}

export function ProviderBuildClientProp() {
  return (
    <ProviderTemplate
      schema={gql`
        scalar JSON

        directive @variant(name: VARIANT) on FIELD_DEFINITION

        enum VARIANT {
          HIGH
          LOW
        }

        type Query {
          getHigh: JSON @variant(name: HIGH)
        }

        type Mutation {
          changePitchLevel(level: Float!): JSON!
        }
      `}
      scalars={{ JSON: JSONResolver }}
    />
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
