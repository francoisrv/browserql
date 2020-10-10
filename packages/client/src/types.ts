import { DocumentNode, GraphQLScalarType } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export type Dictionary<A = any> = {
  [name: string]: A;
};

export interface Schemaql {
  schema?: DocumentNode | string
  queries?: Dictionary<(...args: any[]) => any>
  mutations?: Dictionary<(...args: any[]) => any>
  scalars?: Dictionary<GraphQLScalarType>
  directives?: Dictionary<Function>
}

export type SchemaqlFactory = (obj: Schemaql) => Schemaql
