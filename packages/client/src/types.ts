import { DocumentNode } from 'graphql'
import Schema from './Schema'
import Client from './Client'

export interface Transaction {
  name: string
  type: 'query' | 'mutation'
  node: DocumentNode
  source: string
}

export type Plugin = (
  schema?: Schema,
  resolvers?: any,
  getClient?: () => Client
) => any

export interface ConnectOptions {
  schema: DocumentNode | string
  resolvers?: {
    [field: string]: Function
  }
  plugins?: Plugin[]
  debug?: boolean
}

export interface ClientContext {
  getBrowserQLClient(): Client
}

export type ResolverMiddleware = (input: any, getClient: () => Client) => Promise<any>
