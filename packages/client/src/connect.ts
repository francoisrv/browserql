import ApolloClient from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import gql from 'graphql-tag';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

import Client from './Client';
import { Transaction, ConnectOptions } from './types';
import Schema from './Schema';
import buildTransactions from './buildTransactions';
import createFragments from './createFragments';
import { map } from 'lodash';

export default function connect(options: ConnectOptions): Client {
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
  const { mutations = {} } = options;
  const schema = new Schema(options.schema);

  const rootValue: any = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
  };

  schema.extend(gql`
    scalar JSON
    scalar JSONObject

    type MutationResult {
      done: Boolean!
    }
  `);

  for (const name in mutations) {
    if (!rootValue[name]) {
      rootValue[name] = mutations[name];
    }
  }

  createFragments(schema);

  const transactions: Transaction[] = buildTransactions(schema);

  let ast: any;

  try {
    ast = schema.toAST();
  } catch (error) {
    throw error;
  }

  let browserQLClient: Client;

  const client: ApolloClient<any> = new ApolloClient({
    link: new SchemaLink({
      schema: ast,
      rootValue,
      context: () => ({ client: browserQLClient }),
    }),
    cache,
  });

  browserQLClient = new Client(client, schema, transactions, mutations);

  return browserQLClient;
}
