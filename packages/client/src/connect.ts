import ApolloClient from 'apollo-client'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import gql from 'graphql-tag'
import { print } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import enhanceSchema from '@browserql/schemax'

import { ConnectMiddleware, ConnectOptions } from './types/ConnectOptions'
import { merge } from 'lodash'

export default function connect(
  options: ConnectOptions,
  ...middlewares: ConnectMiddleware[]
) {
  const cache = new InMemoryCache({
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [],
        },
      },
    }),
  })

  let { directives = {}, mutations = {}, queries = {}, scalars = {} } = options

  const schema =
    typeof options.schema === 'string' ? gql(options.schema) : options.schema

  const schemax = enhanceSchema(schema)

  for (const middleware of middlewares) {
    const response = middleware(schemax.get(), {
      directives,
      mutations,
      queries,
      scalars,
    })
    schemax.extend(response.schema)
    directives = merge(directives, response.directives)
    mutations = merge(mutations, response.mutations)
    queries = merge(queries, response.queries)
    scalars = merge(scalars, response.scalars)
  }

  const rootValue: any = {}

  for (const name in queries) {
    if (!rootValue[name]) {
      rootValue[name] = queries[name]
    }
  }

  for (const name in mutations) {
    if (!rootValue[name]) {
      rootValue[name] = mutations[name]
    }
  }

  for (const name in scalars) {
    if (!rootValue[name]) {
      rootValue[name] = scalars[name]
    }
  }

  const apollo = new ApolloClient({
    link: new SchemaLink({
      rootValue: rootValue,
      schema: makeExecutableSchema({
        typeDefs: print(schema),
        schemaDirectives: directives,
      }),
    }),
    cache,
  })

  return {
    client: apollo,
    schema: schemax.get(),
    directives,
    mutations,
    queries,
    scalars,
  }
}
