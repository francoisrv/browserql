import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { buildASTSchema, printSchema, extendSchema, buildSchema, DocumentNode, parse, GraphQLSchema, printIntrospectionSchema } from 'graphql'
import gql from 'graphql-tag'
import makeQueryTransaction from './makeQueryTransaction'

type Plugin = (
  schema: GraphQLSchema
) => {
  schema: DocumentNode,
  resolvers: any
}

interface ConnectOptions {
  schema: DocumentNode | string
  resolvers?: {
    [field: string]: Function
  }
  plugins?: Plugin[]
}

interface ConnectResults {
  client: ApolloClient<any>
  transactions: Transaction[]
}

enum TransactionType {
  query,
  mutation
}

interface Transaction {
  name: string
  type: TransactionType
  node: DocumentNode
}

const base = gql`
type Query {
  ping: Int!
}
type Mutation {
  pong: Int!
}
`

export default function connect(options: ConnectOptions): ConnectResults {
  const cache = new InMemoryCache()
  
  const { resolvers = {} } = options

  const schema = typeof options.schema === 'string' ? gql(options.schema) : options.schema

  let ast = extendSchema(
    buildASTSchema(base),
    schema,
    { assumeValid: true }
  )

  if (options.plugins) {
    for (const plugin of options.plugins) {
      const { schema: pluginSchema, resolvers: pluginResolvers } = plugin(ast)
      ast = extendSchema(ast, pluginSchema)
      Object.assign(resolvers, pluginResolvers)
    }
  }

  const transactions: Transaction[] = []

  const query = ast.getQueryType()

  const queries = query?.getFields()

  for (const queryName in queries) {
    transactions.push({
      name: queryName,
      type: TransactionType.query,
      node: makeQueryTransaction(queryName, queries[queryName])
    })
  }

  console.log(printSchema(ast), resolvers)
  
  const link = new SchemaLink({
    schema: ast,
    rootValue: resolvers
  })
  
  const client = new ApolloClient({
    link,
    cache,
  })

  return {
    client,
    transactions,
  }
}
