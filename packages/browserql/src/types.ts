import { DocumentNode } from "graphql";
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
}