import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import gql from 'graphql-tag'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import Client from './Client'
import { Transaction, ConnectOptions } from './types'
import Schema from './Schema'
import buildTransactions from './buildTransactions'
import Resolver from './Resolver'
import { Dictionary } from 'lodash'
import Query from './Query'

export default function connect(options: ConnectOptions): Client {
  const cache = new InMemoryCache()
  const { queries: inputQueries = {} } = options
  const context: any = {}
  const schema = new Schema(options.schema)
  const rootValue: any = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
  }
  const queries: Dictionary<Query> = {}
  const onClients: ((client: Client) => void)[] = []
  let browserQLClient: Client

  function getBrowserQLClient() {
    return browserQLClient
  }

  schema.extend(gql`
  scalar JSON
  scalar JSONObject
  `)

  for (const name in inputQueries) {
    const resolver = new Query(name, getBrowserQLClient)
    queries[name] = resolver
    resolver.push(inputQueries[name])
  }

  if (options.plugins) {
    for (const plugin of options.plugins) {
      const res = plugin({
        schema,
        queries,
        getClient: getBrowserQLClient
      })
      if (res.context) {
        Object.assign(context, res.context)
      }
      if (res.onClient) {
        onClients.push(res.onClient)
      }
    }
  }

  for (const name in queries) {
    if (!rootValue[name]) {
      rootValue[name] = queries[name].execute.bind(queries[name])
    }
  }

  const transactions: Transaction[] = buildTransactions(schema)

  let ast: any

  try {
    ast = schema.toAST()
  } catch (error) {
    console.log(schema.toString())
    throw error
  }

  const link = new SchemaLink({
    schema: ast,
    // rootValue,
    context: { getBrowserQLClient }
  })
  
  const client = new ApolloClient({
    link,
    cache,
  })

  browserQLClient = new Client(
    client,
    queries,
    schema,
    transactions,
    context,
    schema.toString()
  )

  for (const onClient of onClients) {
    onClient(browserQLClient)
  }

  return browserQLClient
}
