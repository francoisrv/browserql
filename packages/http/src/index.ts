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
              const url = getArgument('url')(http)

              const urlValue = getValue(url)

              const paramerizedUrl = applyParameters(urlValue, variables)
              const searchParams = new URLSearchParams(variables).toString()
              const finalUrl = searchParams
                ? `${paramerizedUrl}?${searchParams}`
                : paramerizedUrl
              const response = await fetch(finalUrl)
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
