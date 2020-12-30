import * as React from 'react'
import { gql, useQuery, ApolloProvider, ApolloClient } from '@apollo/client'
// import ApolloClient from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { BrowserqlProvider } from '@browserql/react'
import { buildQuery } from '@browserql/operations'

const query = gql`
  query Q22($to: String!) {
    sayHello(to: $to)
  }
`

function SayHello({ to }: { to: string }) {
  console.log(123)
  const { data, loading, error } = useQuery(query, {
    variables: { to },
    errorPolicy: 'all',
  })
  console.log({ data, loading, error })
  if (error) {
    throw error
  }
  if (loading) return <div>Loading...</div>
  return <p>{data.sayHello}</p>
}

const Query = React.memo(SayHello, () => true)

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

  const client = new ApolloClient({
    link: new SchemaLink({
      rootValue: {
        ...queries,
      },
      schema: makeExecutableSchema({
        typeDefs: [schema],
      }),
    }),
    cache: new InMemoryCache({
      addTypename: true,
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: [],
          },
        },
      }),
    }),
  })

  console.log({ client })

  return (
    <ApolloProvider client={client}>
      <Query to="everybody" />
    </ApolloProvider>
  )

  // return (
  //   <BrowserqlProvider schema={schema} queries={queries}>
  //     <SayHello to="everybody" />
  //   </BrowserqlProvider>
  // )
}
