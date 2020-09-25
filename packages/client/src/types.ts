import { DocumentNode, FragmentDefinitionNode } from 'graphql';
import Schema from './Schema';
import Client from './Client';
import { Dictionary } from 'lodash';
import Query from './Query';
import Mutation from './Mutation';

export type Context = Dictionary<any>;

export interface Transaction {
  name: string;
  type: 'query' | 'mutation';
  node: DocumentNode;
  source: string;
  fragments: FragmentDefinitionNode[];
}

export interface PluginOptions {
  schema: Schema;
  mutations: Dictionary<Mutation>;
  getClient: () => Client;
}

export interface PluginOutput {
  context?: Context;
  onClient?: (client: Client) => void;
}

export type Plugin = (options: PluginOptions) => PluginOutput;

/**
 * Options to pass to the connect function
 * In order to create a client
 */
export interface ConnectOptions {
  debug?: boolean;
  mutations?: Dictionary<MutationResolver>;
  schema: DocumentNode | string;
}

export type MutationResolver<V = any> = (
  input: V,
  context: {
    client: Client;
  }
) => void | Promise<void>;

export interface ClientContext {
  getBrowserQLClient(): Client;
}

export type QueryMiddleware = (input: any, getClient: () => Client) => any;

export type MutationMiddleware = (
  input: any,
  getClient: () => Client
) => Promise<any>;
