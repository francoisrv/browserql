import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import printExecutableMutation from './printExecutableMutation'

/**
 *
 * @param schema
 * @param mutationName
 */
export default function makeExecutableMutation(
  schema: DocumentNode,
  mutationName: string
): DocumentNode {
  return gql(printExecutableMutation(schema, mutationName))
}
