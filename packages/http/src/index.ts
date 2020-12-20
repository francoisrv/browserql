import type { SchemaqlFactory } from '@browserql/types'
import {
  getArgument,
  getArguments,
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

interface HttpRequestOptions {}

function httpRequest() {}

export function connectHttp(options: ConnectHttpOptions = {}): SchemaqlFactory {
  return function ({ schema }) {
    const ourSchema = gql`
      input HttpHeader {
        name: String!
        value: String!
      }

      directive @httpGet(
        url: String
        pathname: String
        headers: [HttpHeader!]
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
              const urlValue = getValue(url)
              const finalUrl = applyParameters(urlValue, variables)
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
