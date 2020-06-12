import find from 'lodash.find'
import get from 'lodash.get'
import ApolloClient from 'apollo-client'
import { DocumentNode } from 'graphql'
import { Transaction } from './types'
import Schema from './Schema'

export default class Client {

  constructor(
    public readonly apollo: ApolloClient<any>,
    private readonly resolvers: any,
    private readonly schema: Schema,
    private readonly transactions: Transaction[],
    private readonly context: any,
    private readonly source: string,
  ) {
  }

  // SCHEMA

  printSchema() {
    return this.source
  }

  getSchema() {
    return this.schema
  }

  // QUERY

  readQuery(name: string, variables?: any) {
    const query = this.getQuery(name)
    if (!query) {
      throw new Error(`Could not find query: ${ name }`)
    }
    return this.apollo.readQuery({ query, variables })
  }

  getQuery(name: string): DocumentNode | undefined {
    return get(find(this.transactions, { name }), 'node')
  }

  query(name: string, variables?: any) {
    const query = this.getQuery(name)
    if (!query) {
      throw new Error(`Could not find query: ${ name }`)
    }
    return this.apollo.query({
      query,
      variables
    })
  }

  writeQuery(name: string, data: any) {
    const query = this.getQuery(name)
    if (!query) {
      throw new Error(`Could not find query: ${ name }`)
    }
    return this.apollo.writeQuery({
      query,
      data: { [name]: data }
    })
  }

  // MUTATION

  getMutation(name: string): DocumentNode | undefined {
    return this.getQuery(name)
  }

  mutate(name: string, variables?: any) {
    const mutation = this.getMutation(name)
    if (!mutation) {
      throw new Error(`Could not find mutation: ${ name }`)
    }
    return this.apollo.mutate({
      mutation,
      variables
    })
  }

  // CONTEXT

  getContext(path?: string) {
    if (path) {
      return get(this.context, path)
    }
    return this.context
  }

  // TRANSACTIONS

  getTransactions() {
    return this.transactions
  }
}
