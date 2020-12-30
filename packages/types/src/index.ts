import type { InMemoryCache } from 'apollo-cache-inmemory'
import type ApolloClient from 'apollo-client'
import type { DocumentNode, GraphQLScalarType } from 'graphql'
import { SchemaDirectiveVisitorClass } from '@graphql-tools/utils'

export type Dictionary<A = any> = {
  [name: string]: A
}

export interface Resolvers {
  queries?: Dictionary<(...args: any[]) => any>
  mutations?: Dictionary<(...args: any[]) => any>
  scalars?: Dictionary<GraphQLScalarType>
  directives?: Record<string, SchemaDirectiveVisitorClass>
}

export interface Schemaql extends Resolvers {
  schema?: DocumentNode
  context?: Dictionary<any>
}

export type SchemaqlFactory = (obj: Schemaql) => Schemaql

export type BrowserqlContext = Dictionary<any> & {
  browserqlClient: BrowserqlClient
}

export interface BrowserqlClient {
  client: ApolloClient<any>
  apollo: ApolloClient<any>
  cache: InMemoryCache
  schema: DocumentNode
  queries: Dictionary<(...args: any[]) => any>
  mutations: Dictionary<(...args: any[]) => any>
  scalars: Dictionary<GraphQLScalarType>
  directives?: Record<string, SchemaDirectiveVisitorClass>
  context: BrowserqlContext
}
