import type { DocumentNode } from 'graphql'
import type { SchemaqlFactory } from '@browserql/types'
import type { firestore } from 'firebase'
import build from './build'

export default function connect(
  db: firestore.Firestore,
  schema: DocumentNode | string
): SchemaqlFactory {
  return () => build(db, schema)
}
