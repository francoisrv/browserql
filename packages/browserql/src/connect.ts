import ApolloClient from 'apollo-client'
import find from 'lodash.find'
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { buildASTSchema, printSchema, extendSchema } from 'graphql'

import Client from './Client'
import makeTransaction from './makeTransaction'
import { Transaction, TransactionType, ConnectOptions } from './types'

const base = gql`
directive @browserql on OBJECT
`

export default function connect(options: ConnectOptions): Client {
  const cache = new InMemoryCache()
  
  const { resolvers = {} } = options

  const context: any = {}

  const schema = typeof options.schema === 'string' ? gql(options.schema) : options.schema

  // let ast = extendSchema(
  //   buildASTSchema(base),
  //   schema,
  //   { assumeValid: true }
  // )

  let ast = buildASTSchema(schema, { assumeValid: true })

  const rehydrates: any[] = []

  if (options.plugins) {
    for (const plugin of options.plugins) {
      const { schema: pluginSchema, resolvers: pluginResolvers, rehydrateWithClient, context: pluginContext = {} } = plugin(ast)
      if (rehydrateWithClient) {
        rehydrates.push(rehydrateWithClient)
      }
      ast = extendSchema(ast, pluginSchema)
      Object.assign(resolvers, pluginResolvers)
      Object.assign(context, pluginContext)
    }
  }

  const transactions: Transaction[] = []

  const query = ast.getQueryType()
  const mutation = ast.getMutationType()

  const queries = query?.getFields()
  const mutations = mutation?.getFields()

  for (const queryName in queries) {
    const q = makeTransaction(TransactionType.query, queryName, queries[queryName])
    transactions.push({
      name: queryName,
      type: TransactionType.query,
      source: q,
      node: gql(q)
    })
  }

  for (const mutationName in mutations) {
    const q = makeTransaction(TransactionType.mutation, mutationName, mutations[mutationName])
    transactions.push({
      name: mutationName,
      type: TransactionType.mutation,
      source: q,
      node: gql(q)
    })
  }

  const source = printSchema(ast)
  
  const link = new SchemaLink({
    schema: ast,
    rootValue: resolvers
  })
  
  const client = new ApolloClient({
    link,
    cache,
  })

  const transaction = (name: string) => find(transactions, { name })

  for (const rehydrate of rehydrates) {
    rehydrate({client, resolvers, transaction})
  }

  return new Client(
    client,
    resolvers,
    schema,
    transactions,
    context
  )
}
