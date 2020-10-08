import { ConnectMiddleware } from '@browserql/client'
import enhanceSchema, { getName, hasDirective } from '@browserql/schemax'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'

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

export default function connectHttp(
  options: ConnectHttpOptions = {}
): ConnectMiddleware {
  return function (document: DocumentNode) {
    const ourSchema = gql`
      scalar JSON

      directive @httpGet(url: String) on FIELD_DEFINITION

      directive @httpPost(url: String) on FIELD_DEFINITION

      directive @httpPut(url: String) on FIELD_DEFINITION

      directive @httpDelete(url: String) on FIELD_DEFINITION

      directive @httpHead(url: String) on FIELD_DEFINITION

      enum HttpMethod {
        GET
        POST
        PUT
        DELETE
        HEAD
      }

      input HttpHeaders {
        name: String!
        value: String!
      }

      type HttpResponse {
        statusCode: Int!
        body: String
      }

      type Query {
        httpRequest(
          method: HttpMethod = GET
          url: String!
          body: JSON
          headers: HttpHeaders
        ): HttpResponse
      }
    `
    const schema = enhanceSchema(document)
    const targetQueries = schema
      .getQueries()
      .filter(
        (query) =>
          hasDirective(query, 'httpGet') ||
          hasDirective(query, 'httpPut') ||
          hasDirective(query, 'httpPost') ||
          hasDirective(query, 'httpDelete') ||
          hasDirective(query, 'httpHead')
      )
      .reduce((queries, query) => {
        if (hasDirective(query, 'httpGet')) {
          return {
            ...queries,
            [getName(query)]: async () => {
              const response = await fetch('/foo')
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
      scalars: {
        JSON: GraphQLJSON,
      },
    }
  }
}
