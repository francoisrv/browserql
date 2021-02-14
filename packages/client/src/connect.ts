import type { DocumentNode } from 'graphql'

import type {
  BrowserqlClient,
  BrowserqlClientProperty,
  BrowserqlClientPropertyFactory,
  Context,
  Directives,
  Operations,
  Scalars,
  Subscriptions,
} from '@browserql/types'

import { merge } from '@browserql/fpql'

import makeCache from './cache'
import makeSchema from './schema'
import makeApolloClient from './apollo'

export default function connect(
  ...args: Array<
    BrowserqlClientProperty | BrowserqlClientPropertyFactory | DocumentNode
  >
): BrowserqlClient {
  const cache = makeCache()
  const context: Context = {}
  const directives: Directives = {}
  const mutations: Operations = {}
  const queries: Operations = {}
  const rootValue: Record<string, any> = {}
  const scalars: Scalars = {}
  const schemas: DocumentNode[] = []
  const subscriptions: Subscriptions = {}

  function applyArg(arg: Partial<BrowserqlClientProperty>) {
    if (arg.schema) {
      schemas.push(arg.schema as DocumentNode)
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

    if (arg.subscriptions) {
      for (const name in arg.subscriptions) {
        subscriptions[name] = arg.subscriptions[name]
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
    if ('definitions' in arg) {
      schemas.push(arg)
    } else if (typeof arg == 'object') {
      applyArg(arg)
    } else if (typeof arg === 'function') {
      const props: Partial<BrowserqlClientProperty> = {
        queries,
        mutations,
        scalars,
        directives,
        context,
        subscriptions,
      }
      if (schemas.length) {
        props.schema = merge(...schemas)
      }
      applyArg(arg(props))
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

  for (const name in subscriptions) {
    if (!rootValue[name]) {
      rootValue[name] = subscriptions[name]
    }
  }

  const finalSchema = merge(...schemas)

  const schema = makeSchema([finalSchema], directives)

  const apollo = makeApolloClient(rootValue, schema, cache, context)

  const browserqlClient = {
    apollo,
    client: apollo,
    cache,
    schema: finalSchema,
    directives,
    mutations,
    queries,
    scalars,
    context,
    subscriptions,
  }

  browserqlClient.context.browserqlClient = browserqlClient

  return browserqlClient
}
