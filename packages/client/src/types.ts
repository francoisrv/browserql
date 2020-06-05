import { DocumentNode, GraphQLSchema } from 'graphql'
import BrowserQLClient from './Client'

export type Client = BrowserQLClient

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
  schema: GraphQLSchema,
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
}

export interface ClientContext {
  getBrowserQLClient(): Client
}
