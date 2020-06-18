import { DocumentNode } from 'graphql'
import Schema from './Schema'
import Client from './Client'
import { Dictionary } from 'lodash'
import Query from './Query'

export type Context = Dictionary<any>

export interface      Transaction {
  name:               string
  type:               'query' | 'mutation'
  node:               DocumentNode
  source:             string
}

export interface      PluginOptions {
  schema:             Schema
  queries:            Dictionary<Query>
  getClient:          () => Client
}

export interface      PluginOutput {
  context?:           Context
  onClient?:          (client: Client) => void
}

export type Plugin = (options: PluginOptions) => PluginOutput

export interface ConnectOptions {
  schema: DocumentNode | string
  queries?: Dictionary<ResolverMiddleware>
  plugins?: Plugin[]
  debug?: boolean
}

export interface ClientContext {
  getBrowserQLClient(): Client
}

export type ResolverMiddleware = (input: any, getClient: () => Client) => Promise<any>
