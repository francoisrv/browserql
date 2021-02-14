import type { InMemoryCache } from 'apollo-cache-inmemory'
import type ApolloClient from 'apollo-client'
import type { DocumentNode, GraphQLScalarType } from 'graphql'
import type { SchemaDirectiveVisitorClass } from '@graphql-tools/utils'

export type Context = Record<string, any>
export type Directives = Record<string, SchemaDirectiveVisitorClass>
export type Operations = Record<
  string,
  (variables: any, ctx: BrowserqlClientContext) => any
>
export type Scalars = Record<string, GraphQLScalarType>
export type Subscriptions = Record<
  string,
  {
    subscribe(): any
  }
>

/**
 * Connectors for browserql client as an object
 */
export interface BrowserqlClientProperty {
  context?: Context
  directives?: Directives
  mutations?: Operations
  queries?: Operations
  scalars?: Scalars
  schema: DocumentNode
  subscriptions?: Subscriptions
}

export type BrowserqlClientPropertyFactory = (
  partialClient: Partial<BrowserqlClientProperty>
) => Partial<BrowserqlClientProperty>

export type BrowserqlClientContext = Context & {
  browserqlClient: BrowserqlClient
}

export interface BrowserqlClient extends BrowserqlClientProperty {
  apollo: ApolloClient<any>
  cache: InMemoryCache
}
