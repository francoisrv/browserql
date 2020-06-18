import { Plugin, Schema, Query } from '@browserql/client'
import gql from 'graphql-tag'

interface PluginOptions {
  fixtures?: {
    [fixture: string]: any
  }
}

export default function browserQLDefaultPlugin(
  options: PluginOptions = {}
): Plugin {
  return function(ctx) {
    ctx.schema.extend(gql`
    directive @default(
      value:        JSON
      resolver:     String
      fixture:      String
      variables:    JSONObject
    ) on FIELD_DEFINITION
    `)

    const queries = ctx.schema.getQueries()

    for (const query of queries) {
      if (Schema.hasDirective(query, 'default')) {
        const name = Schema.getName(query)
        ctx.queries[name] = new Query(name, ctx.getClient)
        .push(variables => {
          const client = ctx.getClient()
          try {
            const cache = client.readQuery(name, variables)
            if (cache === null) {
              throw new Error('Cache is null')
            }
            return cache
          } catch (error) {
            const directiveParams = Schema.getDirectiveParams(query, 'default')
            const data = directiveParams.value
            return data
          }
        })
      }
    }

    return {}
  }
}
