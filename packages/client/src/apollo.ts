import type { Dictionary } from '@browserql/types'
import type { GraphQLSchema } from 'graphql'

import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'

/**
 * Create a new Apollo client
 * @param rootValue
 * @param schema
 * @param cache
 * @param context
 */
export default function makeApolloClient(
  rootValue: any,
  schema: GraphQLSchema,
  cache: InMemoryCache,
  context: Dictionary<any>
) {
  return new ApolloClient({
    link: new SchemaLink({
      rootValue,
      schema,
      context: () => context,
    }),
    cache,
  })
}
