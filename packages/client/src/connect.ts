import ApolloClient from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { ConnectOptions } from './types/ConnectOptions';
import { Dictionary } from './types';

export default function connect(options: ConnectOptions) {
  const cache = new InMemoryCache({
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [],
        },
      },
    }),
  });
  const {
    directives = {},
    extensions = {},
    mutations = {},
    queries = {},
    scalars = {},
  } = options;
  const schema =
    typeof options.schema === 'string' ? gql(options.schema) : options.schema;

  const rootValue: any = {};

  for (const name in queries) {
    if (!rootValue[name]) {
      rootValue[name] = queries[name];
    }
  }

  for (const name in mutations) {
    if (!rootValue[name]) {
      rootValue[name] = mutations[name];
    }
  }

  for (const name in scalars) {
    if (!rootValue[name]) {
      rootValue[name] = scalars[name];
    }
  }

  const ext: Dictionary<any> = {};

  for (const name in extensions) {
    ext[name] = extensions[name]();
  }

  const client: ApolloClient<any> = new ApolloClient({
    link: new SchemaLink({
      rootValue: rootValue,
      schema: makeExecutableSchema({
        typeDefs: print(schema),
        schemaDirectives: directives,
      }),
    }),
    cache,
  });

  return { apollo: client, extensions: ext };
}
