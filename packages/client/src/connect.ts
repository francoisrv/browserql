import ApolloClient from 'apollo-client'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from '@graphql-tools/schema'
import enhanceSchema from '../../schema/dist'

import { Schemaql, SchemaqlFactory } from './types'
import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'

export default function connect(...args: Array<Schemaql|SchemaqlFactory>) {
  const cache = new InMemoryCache({
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [],
        },
      },
    }),
  })

  let schema: ReturnType<typeof enhanceSchema> | null = null
  const schemas: string[] = []

  const rootValue: any = {}
  const directives: any = {}
  const queries: any = {}
  const mutations: any = {}
  const scalars: any = {}

  function applyArg(arg: Schemaql) {
    if (arg.schema) {
      if (!schema) {
        schema = enhanceSchema(arg.schema)
      } else {
        schema.extend(arg.schema)
      }
      schemas.push(enhanceSchema(arg.schema).print())
    }

    if (arg.queries) {
      for (const name in arg.queries) {
        queries[name] = arg.queries[name]
      }
    }

    if (arg.mutations) {
      for (const name in arg.mutations) {
        mutations[name] = arg.mutations[name]
      }
    }

    if (arg.scalars) {
      for (const name in arg.scalars) {
        scalars[name] = arg.scalars[name]
      }
    }

    if (arg.directives) {
      for (const name in arg.directives) {
        if (!directives[name]) {
          directives[name] = arg.directives[name]
        }
      }
    }
  }

  for (const arg of args) {
    if (typeof arg == 'object') {
      applyArg(arg)
    } else {
      applyArg(arg({
        schema: schema ? (schema as ReturnType<typeof enhanceSchema>).get() : '',
        queries,
        mutations,
        scalars,
        directives,
      }))
    }
  }

  for (const name in queries) {
    if (!rootValue[name]) {
      rootValue[name] = queries[name]
    }
  }

  for (const name in mutations) {
    if (!rootValue[name]) {
      rootValue[name] = mutations[name]
    }
  }

  for (const name in scalars) {
    if (!rootValue[name]) {
      rootValue[name] = scalars[name]
    }
  }

  const typeDefs = schemas

  const executableSchema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: directives,
  })

  const apollo = new ApolloClient({
    link: new SchemaLink({
      rootValue: rootValue,
      schema: executableSchema,
    }),
    cache,
  })

  return {
    client: apollo,
    cache,
    schema: schema ? (schema as ReturnType<typeof enhanceSchema>).get() : '',
    directives,
    mutations,
    queries,
    scalars,
  }
}
