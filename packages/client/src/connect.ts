import ApolloClient from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import gql from 'graphql-tag';
import { buildASTSchema } from 'graphql';

import { ConnectOptions } from './types';

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
  const { mutations = {}, queries = {} } = options;
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

  const ast = buildASTSchema(schema);

  const client: ApolloClient<any> = new ApolloClient({
    link: new SchemaLink({
      schema: ast,
      rootValue,
    }),
    cache,
  });

  return { apollo: client };
}
