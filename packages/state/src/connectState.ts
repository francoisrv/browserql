import type { SchemaqlFactory, BrowserqlClientContext } from '@browserql/types'
import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'
import { getName, getQueries, merge } from '@browserql/fpql'
import { JSONResolver } from 'graphql-scalars'
import cacheql from '@browserql/cache'

import { makeExecutableQuery } from '@browserql/executable'

export interface ConnectStateOptions {
  schema?: DocumentNode
}

export default function connectState(): SchemaqlFactory {
  return ({ schema }) => ({
    schema: merge(
      gql`
        scalar JSON
        directive @default(value: JSON) on FIELD_DEFINITION

        extend type Mutation {
          setState(query: StateQuery!, variables: JSON, to: JSON!): Boolean!
        }
      `,
      gql`
        enum StateQuery {
          ${getQueries(schema as DocumentNode)
            .map(getName)
            .join('\n  ')}
        }
      `
    ),
    mutations: {
      setState(
        { query: queryName, to }: { query: string; variables?: any; to: any },
        ctx: BrowserqlClientContext
      ) {
        const query = makeExecutableQuery(schema as DocumentNode, queryName)
        const { cache } = ctx.browserqlClient
        const cachedQueries = cacheql(cache, schema as DocumentNode)
        cachedQueries.set(query, to)
        return true
      },
    },
    scalars: {
      JSON: JSONResolver,
    },
  })
}
