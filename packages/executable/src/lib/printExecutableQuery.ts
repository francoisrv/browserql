import { getQuery } from '@browserql/fpql'
import { DocumentNode } from 'graphql'
import printExecutable from './printExecutable'

/**
 *
 * @param schema
 * @param queryName
 */
export default function printExecutableQuery(
  schema: DocumentNode,
  queryName: string
): string {
  const query = getQuery(queryName)(schema)
  if (!query) {
    throw new Error(`No such query: ${queryName}`)
  }
  return `query ${queryName}${printExecutable(schema, `Query.${queryName}`)}`
}
