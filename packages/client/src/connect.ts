import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'

import Client from './Client'
import { Transaction, ConnectOptions } from './types'
import Schema from './Schema'
import buildTransactions from './buildTransactions'
import Resolver from './Resolver'

export default function connect(options: ConnectOptions): Client {
  const cache = new InMemoryCache()
  const { resolvers = {} } = options
  const context: any = {}
  const schema = new Schema(options.schema)
  const rootValue: any = {}
  const middlewares: any = {}

  for (const name in resolvers) {
    const resolver = new Resolver(name)
    middlewares[name] = resolver
    // @ts-ignore
    resolver.push(resolvers[name])
    rootValue[name] = resolver.execute.bind(resolver)
  }

  if (options.plugins) {
    for (const plugin of options.plugins) {
      const res = plugin(schema, middlewares)
      if (res && res.context) {
        Object.assign(context, res.context)
      }
    }
  }

  for (const name in middlewares) {
    if (!rootValue[name]) {
      rootValue[name] = middlewares[name].execute.bind(middlewares[name])
    }
  }

  const transactions: Transaction[] = buildTransactions(schema)

  console.log(123, transactions.map(t => t.source)[0])

  let browserQLClient: Client

  function getBrowserQLClient() {
    return browserQLClient
  }

  let ast: any

  try {
    ast = schema.toAST()
  } catch (error) {
    console.log(schema.toString())
    throw error
  }

  const link = new SchemaLink({
    schema: ast,
    rootValue,
    context: { getBrowserQLClient }
  })
  
  const client = new ApolloClient({
    link,
    cache,
  })

  browserQLClient = new Client(
    client,
    resolvers,
    schema,
    transactions,
    context,
    schema.toString()
  )

  return browserQLClient
}
