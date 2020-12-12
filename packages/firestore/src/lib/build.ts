import type { DocumentNode } from 'graphql'
import type { Schemaql } from '@browserql/types'
import type { firestore } from 'firebase'

import BASE_SCHEMA from '../schema'

/**
 *
 * @param db {Firestore} a firestore db instance
 * @param schema {string|DoucmentNode} a GraphQL schema
 */
export default function build(
  db: firestore.Firestore,
  schema: DocumentNode | string
): Schemaql {
  return {
    schema: BASE_SCHEMA,
  }
}
