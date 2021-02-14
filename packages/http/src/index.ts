import type { SchemaqlFactory } from '@browserql/types'
import {
  getArgument,
  getDirective,
  getName,
  getQueries,
  getValue,
} from '@browserql/fpql'
import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import { applyParameters } from 'paramizer'

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

      directive @http(url: String, method: HttpMethod) on FIELD_DEFINITION
    `
    const targetQueries = getQueries(schema as DocumentNode)
      .filter((query) => getDirective('http')(query))
      .reduce((queries, query) => {
        const http = getDirective('http')(query)

        if (http) {
          return {
            ...queries,
            [getName(query)]: async (variables: any) => {
              let endpoint = ''
              const options: Partial<RequestInit> = {}

              const url = getArgument('url')(http)
              const method = getArgument('method')(http)

              if (url) {
                endpoint = getValue(url)
              }

              if (method) {
                options.method = method
              }

              for (const key in variables) {
                endpoint = endpoint.replace(
                  new RegExp(`:${key}(\\W|$)`, 'g'),
                  `${variables[key]}$1`
                )
              }

              console.log({ endpoint, variables })

              const response = await fetch(endpoint, options)
              const json = await response.json()
              return json
            },
          }
        }

        return queries
      }, {})

    return {
      schema: ourSchema,
      queries: targetQueries,
    }
  }
}
