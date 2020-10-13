import type { Dictionary } from '@browserql/types'
import type { GraphQLSchema } from 'graphql'

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'

export default function makeApolloClient(
  rootValue: any,
  schema: GraphQLSchema,
  cache: InMemoryCache,
  context: Dictionary<any>,
) {
  return new ApolloClient({
    link: new SchemaLink({
      rootValue,
      schema,
      context: () => context
    }),
    cache,
  })
}
