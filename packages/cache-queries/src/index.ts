import gql from 'graphql-tag'
import type { BrowserqlContext, SchemaqlFactory } from '@browserql/types'
import resolve from '@browserql/resolved'
import type { DocumentNode } from 'graphql'

export default function connectCacheQueries(): SchemaqlFactory {
  return (client) => {
    const resolved = resolve(client.schema as DocumentNode)
    return {
      schema: gql`
        extend type Query {
          readQuery(query: String, variables: JSON): JSON
        }

        extend type Mutation {
          writeQuery(query: String, variables: JSON, data: JSON): JSON
        }
      `,

      queries: {
        readQuery(
          variables: {
            query: string
            variables?: any
          },
          ctx: BrowserqlContext
        ) {
          return ctx.browserqlClient.cache.readQuery(
            resolved.Query[variables.query](variables.variables)
          )
        },
      },

      mutations: {
        writeQuery(
          variables: {
            query: string
            variables?: any
            data: any
          },
          ctx: BrowserqlContext
        ) {
          ctx.browserqlClient.cache.writeQuery({
            ...resolved.Query[variables.query](variables.variables),
            data: {
              [variables.query]: variables.data,
            },
          })
          return { ok: 1 }
        },
      },
    }
  }
}
