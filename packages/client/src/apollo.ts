import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLSchema } from 'graphql';

export default function makeApolloClient(rootValue: any, schema: GraphQLSchema, cache: InMemoryCache) {
  return new ApolloClient({
    link: new SchemaLink({
      rootValue,
      schema,
      context: () => ({
        foo: true
      })
    }),
    cache,
  })
}
