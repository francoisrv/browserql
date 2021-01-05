import type { SchemaqlFactory, BrowserqlClientContext } from '@browserql/types'
import gql from 'graphql-tag'
import type { DocumentNode, FieldDefinitionNode, DirectiveNode } from 'graphql'
import {
  getArgument,
  getDirective,
  getName,
  getQueries,
  getValue,
  merge,
} from '@browserql/fpql'
import { JSONResolver } from 'graphql-scalars'
import cacheql from '@browserql/cache'
import fp from '@browserql/fp'
import { makeExecutableQuery } from '@browserql/executable'

export interface ConnectStateOptions {
  schema?: DocumentNode
}

export default function connectState(): SchemaqlFactory {
  return ({ schema }) => ({
    schema: merge(
      gql`
        scalar JSON

        directive @getState(initialValue: JSON) on FIELD_DEFINITION

        extend type Mutation {
          setState(query: StateQuery!, variables: JSON, to: JSON!): Boolean!

          incrementState(
            query: StateQuery!
            variables: JSON
            step: Float = 1
          ): Boolean!

          multiplyState(
            query: StateQuery!
            variables: JSON
            by: Float = 1
          ): Boolean!
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
    queries: fp(schema)(
      getQueries,
      (queries) => queries.filter(getDirective('getState')),
      (queries) =>
        (queries as FieldDefinitionNode[]).reduce((querySet, query) => {
          const directive = getDirective('getState')(query)
          const initialValue = getArgument('initialValue')(
            directive as DirectiveNode
          )
          if (initialValue) {
            return {
              ...querySet,
              [getName(query)]: () => getValue(initialValue),
            }
          }
          return querySet
        }, {})
    ),
    scalars: {
      JSON: JSONResolver,
    },
  })
}
