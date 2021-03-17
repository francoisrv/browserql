import type { SchemaqlFactory } from '@browserql/types'
import {
  getArgument,
  getDirective,
  getMutations,
  getName,
  getQueries,
  getValue,
} from '@browserql/fpql'
import gql from 'graphql-tag'
import { DirectiveNode, DocumentNode } from 'graphql'
import { applyParameters } from 'paramizer'
import { HeadersJSONObject } from './JSON'

interface ConnectHttpOptions {}

export function connectHttp(options: ConnectHttpOptions = {}): SchemaqlFactory {
  return function ({ schema }) {
    const ourSchema = gql`
      enum HttpMethod {
        DELETE
        GET
        HEAD
        OPTIONS
        PATCH
        POST
        PUT
      }

      directive @http(
        url: String
        method: HttpMethod
        headers: HeadersJSONObject
      ) on FIELD_DEFINITION

      scalar HeadersJSONObject
    `
    const makeResolver = (
      type: 'query' | 'mutation',
      http: DirectiveNode
    ) => async (variables: any) => {
      let endpoint = ''
      const options: Partial<RequestInit> = {}

      const url = getArgument('url')(http)
      const method = getArgument('method')(http)
      const headers = getArgument('headers')(http) as {
        key: string
        value: string
      }[]

      if (url) {
        endpoint = getValue(url)
      }

      if (method) {
        options.method = getValue(method)
      }

      for (const key in variables) {
        endpoint = endpoint.replace(
          new RegExp(`:${key}(\\W|$)`, 'g'),
          `${variables[key]}$1`
        )
      }

      if (headers) {
        options.headers = headers.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        )
      }

      const response = await fetch(endpoint, options)
      const json = await response.json()
      return json
    }
    const targetQueries = getQueries(schema as DocumentNode)
      .filter((query) => getDirective('http')(query))
      .reduce((queries, query) => {
        const http = getDirective('http')(query)

        if (http) {
          return {
            ...queries,
            [getName(query)]: makeResolver('query', http),
          }
        }

        return queries
      }, {})
    const targetMutations = getMutations(schema as DocumentNode)
      .filter((query) => getDirective('http')(query))
      .reduce((queries, query) => {
        const http = getDirective('http')(query)

        if (http) {
          return {
            ...queries,
            [getName(query)]: makeResolver('mutation', http),
          }
        }

        return queries
      }, {})

    return {
      schema: ourSchema,
      queries: targetQueries,
      mutations: targetMutations,
      scalars: {
        HeadersJSONObject,
      },
    }
  }
}
