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
    private readonly context: any,
    private readonly source: string,
  ) {
  }

  // SOURCE

  printSchema() {
    return this.source
  }

  // QUERY

  readQuery(name: string, variables?: any) {
    const query = this.getQuery(name)
    return this.apollo.readQuery({ query, variables })
  }

  getQuery(name: string): DocumentNode {
    return get(find(this.transactions, { name }), 'node')
  }

  query(name: string, variables?: any) {
    const query = this.getQuery(name)
    return this.apollo.query({
      query,
      variables
    })
  }

  // MUTATION

  getMutation(name: string): DocumentNode {
    return this.getQuery(name)
  }

  mutate(name: string, variables?: any) {
    const mutation = this.getMutation(name)
    return this.apollo.mutate({
      mutation,
      variables
    })
  }

  getContext(path?: string) {
    if (path) {
      return get(this.context, path)
    }
    return this.context
  }
}
