import { DocumentNode } from 'graphql';
import { Dictionary } from 'lodash';

/**
 * Options to pass to the connect function
 * In order to create a client
 */
export interface ConnectOptions {
  mutations?: Dictionary<GraphQLOperation>;
  queries?: Dictionary<GraphQLOperation>;
  schema: DocumentNode | string;
}

export type GraphQLOperation = (data: any) => Promise<any>;

export interface ClientOptions {
  mutations?: Dictionary<GraphQLOperation>;
  queries?: Dictionary<GraphQLOperation>;
}
