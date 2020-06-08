import ApolloClient from 'apollo-client'
import find from 'lodash.find'
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { buildASTSchema, printSchema, extendSchema, GraphQLObjectType, GraphQLID, print, isSpecifiedScalarType, isSpecifiedDirective  } from 'graphql'
import shortid from 'shortid'

import Client from './Client'
import makeTransaction from './makeTransaction'
import { Transaction, TransactionType, ConnectOptions } from './types'
import Schema from './Schema'

export default function connect(options: ConnectOptions): Client {
  const cache = new InMemoryCache()
  const { resolvers = {} } = options
  const context: any = {}
  const schema = new Schema(options.schema)

  if (options.plugins) {
    for (const plugin of options.plugins) {
      const {
        schema: pluginSchema,
        resolvers: pluginResolvers,
        context: pluginContext = {}
      } = plugin(schema, resolvers)
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

  let browserQLClient: Client

  function getBrowserQLClient() {
    return browserQLClient
  }

  const link = new SchemaLink({
    schema: ast,
    rootValue: resolvers,
    context: { getBrowserQLClient }
  })
  
  const client = new ApolloClient({
    link,
    cache,
  })

  const source = printSchema(ast)

  browserQLClient = new Client(
    client,
    resolvers,
    schema,
    transactions,
    context,
    source
  )

  return browserQLClient
}
