import { DocumentNode } from 'graphql';

import { Dictionary } from '../types';

/**
 * Options to pass to the connect function
 * In order to create a client
 */
export interface ConnectOptions {
  mutations?: Dictionary<GraphQLOperation>;
  queries?: Dictionary<GraphQLOperation>;
  scalars?: Dictionary<GraphQLScalar>;
  schema: DocumentNode | string;
}

export type GraphQLOperation = (data: any) => any | Promise<any>;

export type GraphQLScalar = any;
