import type { DocumentNode } from 'graphql'
import resolve from '@browserql/resolved'

export default function get(schema: DocumentNode, collection: string) {
  const name = `firestore_getMany_${collection}`
  const { Query } = resolve(schema)
  return Query[name]()
}
