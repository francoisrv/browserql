import { DocumentNode } from "graphql";

export enum TransactionType {
  query = 'query',
  mutation = 'mutation'
}

export interface Transaction {
  name: string
  type: TransactionType
  node: DocumentNode
}