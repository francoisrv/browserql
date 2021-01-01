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
      directive @http(url: String) on FIELD_DEFINITION
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

              const url = getArgument('url')(http)

              if (url) {
                endpoint = getValue(url)
              }

              for (const key in variables) {
                endpoint = endpoint.replace(
                  new RegExp(`:${key}(\\W|$)`, 'g'),
                  `${variables[key]}$1`
                )
              }

              console.log({ endpoint, variables })

              const response = await fetch(endpoint)
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
