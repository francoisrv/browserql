import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLSchema } from 'graphql';
import { Dictionary } from './types';

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
