import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { buildASTSchema, printSchema, extendSchema, buildSchema } from 'graphql'

interface ConnectOptions {}

export default function connect(options: ConnectOptions) {
  const cache = new InMemoryCache()

  const astSchema = buildASTSchema(options.schema)
  
  const source = printSchema(astSchema)
  
  const extendedAstSchema = extendSchema(buildSchema(source), options.schema)
  
  console.log(printSchema(extendedAstSchema))
  
  const link = new SchemaLink({
    schema: extendedAstSchema,
    rootValue: options.resolvers
  })

  return new ApolloClient({
    link,
    cache,
  })
}
