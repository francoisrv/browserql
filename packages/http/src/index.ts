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

interface ConnectHttpOptions {
  directives?: {
    json?: {
      importDirective?: boolean
      useDirective?: string
    }
  }
}

export function connectHttp(options: ConnectHttpOptions = {}): SchemaqlFactory {
  return function ({ schema }) {
    const ourSchema = gql`
      scalar JSON

      input HttpHeader {
        name: String!
        value: String!
      }

      directive @httpGet(
        url: String
        pathname: String
        headers: [HttpHeader!]
        query: JSON
        useVariablesAsPathParameters: Boolean = false
        useVariablesAsSearchParameters: Boolean = false
      ) on FIELD_DEFINITION

      directive @httpHead(
        url: String
        pathname: String
        useVariablesAsPathParameters: Boolean = false
        useVariablesAsSearchParameters: Boolean = false
      ) on FIELD_DEFINITION

      directive @httpOptions(
        url: String
        pathname: String
        useVariablesAsPathParameters: Boolean = false
        useVariablesAsSearchParameters: Boolean = false
      ) on FIELD_DEFINITION

      directive @httpDelete(
        url: String
        pathname: String
        useVariablesAsPathParameters: Boolean = false
        useVariablesAsSearchParameters: Boolean = false
      ) on FIELD_DEFINITION

      directive @httpPost(
        url: String
        pathname: String
        useVariablesAsPathParameters: Boolean = false
        useVariablesAsSearchParameters: Boolean = false
        useVariablesAsPayload: Boolean = false
      ) on FIELD_DEFINITION
    `
    const targetQueries = getQueries(schema as DocumentNode)
      .filter(
        (query) =>
          getDirective('httpGet')(query) ||
          getDirective('httpPut')(query) ||
          getDirective('httpPost')(query) ||
          getDirective('httpDelete')(query) ||
          getDirective('httpHead')(query)
      )
      .reduce((queries, query) => {
        const httpGet = getDirective('httpGet')(query)

        if (httpGet) {
          return {
            ...queries,
            [getName(query)]: async (variables: any) => {
              const url = getArgument('url')(httpGet)
              const query = getArgument('query')(httpGet)

              const urlValue = getValue(url)
              const queryValue = getValue(query)

              const paramerizedUrl = applyParameters(urlValue, variables)
              const searchParams = new URLSearchParams(variables).toString()
              const finalUrl =
                searchParams && queryValue !== false
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
