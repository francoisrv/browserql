import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import printExecutableQuery from './printExecutableQuery'

/**
 *
 * @param schema
 * @param queryName
 */
export default function makeExecutableQuery(
  schema: DocumentNode,
  queryName: string
): DocumentNode {
  const Q = printExecutableQuery(schema, queryName)
  return gql(Q)
}
