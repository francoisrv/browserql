import { DocumentNode } from 'graphql'
import Schema from './Schema'
import Client from './Client'

export enum TransactionType {
  query = 'query',
  mutation = 'mutation'
}

export interface Transaction {
  name: string
  type: TransactionType
  node: DocumentNode
  source: string
}

export type Plugin = (
  schema: Schema,
  resolvers: any
) => {
  schema: DocumentNode
  resolvers?: any
  context?: any
}

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
