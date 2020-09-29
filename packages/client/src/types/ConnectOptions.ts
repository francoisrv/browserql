import { DocumentNode } from 'graphql';

import { Dictionary } from '../types';
import { BrowserqlExtension } from './BrowserqlExtension';

/**
 * Options to pass to the connect function
 * In order to create a client
 */
export interface ConnectOptions {
  directives?: Dictionary<GraphQLDirective>;
  extensions?: Dictionary<BrowserqlExtension>;
  mutations?: Dictionary<GraphQLOperation>;
  queries?: Dictionary<GraphQLOperation>;
  scalars?: Dictionary<GraphQLScalar>;
  schema: DocumentNode | string;
}

export type GraphQLOperation = (data: any) => any | Promise<any>;

export type GraphQLScalar = any;

export type GraphQLDirective = any;
