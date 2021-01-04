import type { DocumentNode } from 'graphql'
import { makeExecutableQuery } from '@browserql/executable'

export default function get(schema: DocumentNode, collection: string) {
  const name = `firestore_getMany_${collection}`
  const query = makeExecutableQuery(schema, name)
  return query
}
