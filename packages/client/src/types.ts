import { DocumentNode, GraphQLScalarType } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export type Dictionary<A = any> = {
  [name: string]: A;
};

export interface Resolvers {
  queries?: Dictionary<(...args: any[]) => any>
  mutations?: Dictionary<(...args: any[]) => any>
  scalars?: Dictionary<GraphQLScalarType>
  directives?: Record<string, typeof SchemaDirectiveVisitor>
}

export interface Schemaql extends Resolvers {
  schema?: DocumentNode | string
  context?: Dictionary<any>
}

export type SchemaqlFactory = (obj: Schemaql) => Schemaql
