import find from 'lodash.find'
import get from 'lodash.get'
import ApolloClient from 'apollo-client'
import { DocumentNode } from 'graphql'

export default class Client {

  constructor(
    public readonly apollo: ApolloClient<any>,
    private readonly resolvers: any,
    private readonly schema: any,
    private readonly transactions: any[],
    private readonly context: any
  ) {
  }

  readQuery(options: any) {
    return this.apollo.readQuery(options)
  }

  getQuery(name: string): DocumentNode {
    return get(find(this.transactions, { name }), 'node')
  }

  getContext(path?: string) {
    if (path) {
      return get(this.context, path)
    }
    return this.context
  }

  getMutation(name: string): DocumentNode {
    return this.getQuery(name)
  }

  getCacheQueryData(name: string, variables?: any) {
    const query = this.getQuery(name)
    return this.apollo.readQuery({ query, variables })
  }
}