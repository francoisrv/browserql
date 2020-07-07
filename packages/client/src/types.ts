import { DocumentNode, FragmentDefinitionNode } from 'graphql'
import Schema from './Schema'
import Client from './Client'
import { Dictionary } from 'lodash'
import Query from './Query'
import Mutation from './Mutation'

export type Context = Dictionary<any>

export interface      Transaction {
  name:               string
  type:               'query' | 'mutation'
  node:               DocumentNode
  source:             string
  fragments:          FragmentDefinitionNode[]
}

export interface      PluginOptions {
  schema:             Schema
  queries:            Dictionary<Query>
  mutations:          Dictionary<Mutation>
  getClient:          () => Client
}

export interface      PluginOutput {
  context?:           Context
  onClient?:          (client: Client) => void
}

export type Plugin = (options: PluginOptions) => PluginOutput

export interface ConnectOptions {
  schema: DocumentNode | string
  queries?: Dictionary<QueryMiddleware>
  mutations?: Dictionary<MutationMiddleware>
  plugins?: Plugin[]
  debug?: boolean
}

export interface ClientContext {
  getBrowserQLClient(): Client
}

export type QueryMiddleware = (input: any, getClient: () => Client) => any

export type MutationMiddleware = (input: any, getClient: () => Client) => Promise<any>
