import type { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

import GraphqlSchemaClass from './GraphqlSchemaClass'

export { GraphqlSchemaClass }

export default function makeSchemaClass<Schema = unknown>(
  defs: string | string[] | DocumentNode
) {
  let schema: DocumentNode

  if (typeof defs === 'string') {
    schema = gql(defs)
  } else if (Array.isArray(defs)) {
    schema = gql(defs)
  } else {
    schema = defs
  }

  return class GraphqlSchema extends GraphqlSchemaClass<Schema> {
    static schema = schema
  }
}
