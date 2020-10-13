import type { InMemoryCache } from 'apollo-cache-inmemory';
import type ApolloClient from 'apollo-client';
import type { DocumentNode, GraphQLScalarType } from 'graphql'
import type { SchemaDirectiveVisitor } from 'graphql-tools'

export type Dictionary<A = any> = {
  [name: string]: A;
};

export interface Resolvers {
  queries?: Dictionary<(...args: any[]) => any>
  mutations?: Dictionary<(...args: any[]) => any>
  scalars?: Dictionary<GraphQLScalarType>
  directives?: Record<string, typeof SchemaDirectiveVisitor>
}

export interface Schemaql extends Resolvers {
  schema?: DocumentNode | string
  context?: Dictionary<any>
}

export type SchemaqlFactory = (obj: Schemaql) => Schemaql

export interface BrowserqlClient {
  client: ApolloClient<any>
  apollo: ApolloClient<any>
  cache: InMemoryCache
  schema: DocumentNode | string
  queries: Dictionary<(...args: any[]) => any>
  mutations: Dictionary<(...args: any[]) => any>
  scalars: Dictionary<GraphQLScalarType>
  directives: Record<string, typeof SchemaDirectiveVisitor>
  context: Dictionary<any> & {
    browserqlClient: BrowserqlClient
  }
}
