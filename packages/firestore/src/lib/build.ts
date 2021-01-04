import type { DocumentNode } from 'graphql'
import type { firestore } from 'firebase'
import { merge } from '@browserql/fpql'

import BASE_SCHEMA from '../schema'
import { makeSchema } from '../utils/graphql'
import { makeResolvers } from '../utils/resolvers'

/**
 * Build a new schema along with its resolvers
 * @param db {Firestore} a firestore db instance
 * @param schema {DocumentNode} a GraphQL schema
 */
export default function build(
  db: firestore.Firestore,
  schema: DocumentNode
): { schema: DocumentNode } {
  return {
    schema: merge(BASE_SCHEMA, ...makeSchema(schema)),
    ...makeResolvers(db, schema),
  }
}
