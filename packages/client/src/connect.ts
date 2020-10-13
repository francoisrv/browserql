import type { DocumentNode } from 'graphql'

import type {
  BrowserqlClient,
  Schemaql,
  SchemaqlFactory,
} from '@browserql/types'

import { mergeTypeDefs } from '@graphql-tools/merge'

import makeCache from './cache'
import makeSchema from './schema'
import makeApolloClient from './apollo'

export default function connect(...args: Array<Schemaql|SchemaqlFactory>): BrowserqlClient {
  const cache = makeCache()

  const schemas: Array<string|DocumentNode> = [
    `
    type Query { browserqlQuery: ID }
    type Mutation { browserqlMutation: ID }
    `
  ]

  const rootValue: any = {}
  const directives: any = {}
  const queries: any = {}
  const mutations: any = {}
  const scalars: any = {}
  const context: any = {}

  function applyArg(arg: Schemaql) {
    if (arg.schema) {
      schemas.push(arg.schema)
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

    if (arg.context) {
      Object.assign(context, arg.context)
    }
  }

  for (const arg of args) {
    if (typeof arg == 'object') {
      applyArg(arg)
    } else {
      applyArg(arg({
        schema: mergeTypeDefs(schemas),
        queries,
        mutations,
        scalars,
        directives,
        context,
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

  const schema = makeSchema(schemas, directives)

  const apollo = makeApolloClient(rootValue, schema, cache, context)

  const finalSchema = mergeTypeDefs(schemas)

  const browserqlClient = {
    apollo,
    client: apollo,
    cache,
    schema: finalSchema,
    directives,
    mutations,
    queries,
    scalars,
    context
  }

  browserqlClient.context.browserqlClient = browserqlClient

  return browserqlClient
}
