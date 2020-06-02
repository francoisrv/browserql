import { Client } from 'browserql'
import { GraphQLSchema } from 'graphql'
import {
  getQueriesWithDirective,
  getDirective,
  getDirectiveValue,
} from 'browserql-utils'

interface PluginOptions {
  fixtures?: {
    [fixture: string]: any
  }
}

export default function browserQLDefaultPlugin(options: PluginOptions = {}) {
  return function(schema: GraphQLSchema, resolvers: any) {
    const extendSchema = `
    directive @default(
      value:        Any
      resolver:     String
      fixture:      String
    ) on FIELD_DEFINITION

    directive @initial(
      value:        Any
      resolver:     String
      fixture:      String
    ) on FIELD_DEFINITION
    `
    const extendResolvers: any = {}
    const queries = getQueriesWithDirective(schema, 'default')
    for (const queryName in queries) {
      const query = queries[queryName]
      extendResolvers[queryName] = (variables: any, { client }: any) => {
        const cached = client.readQuery(queryName, variables)
        if (typeof cached !== 'undefined') {
          return cached
        }
        const directive = getDirective(query, 'default')
        const value = getDirectiveValue(directive, 'value')
        if (typeof value !== 'undefined') {
          return value
        }
        const resolver = getDirectiveValue(directive, 'resolver')
        if (typeof resolver !== 'undefined') {
          return resolvers[resolver](variables, { client })
        }
        const fixture = getDirectiveValue(directive, 'fixture')
        if (typeof fixture !== 'undefined') {
          if (options.fixtures) {
            return options.fixtures[fixture]
          }
        }
        return undefined
      }
    }
    return {
      schema,
    }
  }
}
