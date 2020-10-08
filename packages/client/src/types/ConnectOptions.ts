import { DocumentNode } from 'graphql'

import { Dictionary } from '../types'

export interface Resolvers {
  directives?: Dictionary<GraphQLDirective>
  mutations?: Dictionary<GraphQLOperation>
  queries?: Dictionary<GraphQLOperation>
  scalars?: Dictionary<GraphQLScalar>
}

/**
 * Options to pass to the connect function
 * In order to create a client
 */
export interface ConnectOptions extends Resolvers {
  schema: DocumentNode | string
}

export type GraphQLOperation = (data: any) => any | Promise<any>

export type GraphQLScalar = any

export type GraphQLDirective = any

export interface ConnectMiddlewareResponse extends Resolvers {
  schema?: DocumentNode
}

export type ConnectMiddleware = (
  schema: DocumentNode,
  resolvers: Resolvers
) => ConnectMiddlewareResponse
