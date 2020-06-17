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

  // TRANSACTIONS

  getTransaction(name: string): Transaction | undefined {
    return find(this.transactions, { name })
  }

  // QUERY

  readQuery(name: string, variables?: any) {
    const query = this.getQuery(name)
    if (!query) {
      throw new Error(`Could not find query: ${ name }`)
    }
    const data = this.apollo.readQuery({ query, variables })
    return data[name]
  }

  read(name: string, variables?: any) {
    let data
    try {
      data = this.readQuery(name, variables)
    } catch (error) {
      data = null
    }
    if (data === null) {
      const query = this.schema.getQuery(name)
      if (!query) {
        throw new Error(`Can not find query ${ name }`)
      }
      const type = Schema.printType(query.type)
      if (type === 'String !' || type === 'ID !') {
        return ''
      }
      if (type === 'Int !' || type === 'Float !') {
        return 0
      }
      if (type === 'Boolean !') {
        return false
      }
    }
    return data
  }

  getQuery(name: string): DocumentNode | undefined {
    return get(find(this.transactions, { name }), 'node')
  }

  apolloQuery(name: string, variables?: any) {
    const query = this.getQuery(name)
    if (!query) {
      throw new Error(`Could not find query: ${ name }`)
    }
    return this.apollo.query({
      query,
      variables
    })
  }

  query(name: string, variables?: any) {
    return this.read(name, variables)
  }

  writeQuery(name: string, data: any, variables?: any) {
    const query = this.getQuery(name)
    if (!query) {
      throw new Error(`Could not find query: ${ name }`)
    }
    return this.apollo.writeQuery({
      query,
      variables,
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
