// import type { DocumentNode } from 'graphql'
import { getDirective, getTypes, merge } from '@browserql/fpql'
import type { Schemaql, SchemaqlFactory } from '@browserql/types'
import { firestore } from 'firebase'
import { DocumentNode, print } from 'graphql'

import GraphQLJSON from 'graphql-type-json'
// import { mergeTypeDefs } from '@graphql-tools/merge'
// import { getDirective, getTypes } from '@browserql/fpql'

import SCHEMA from './schema'
import makeContext from './makeContext'
import makeOperations from './makeOperations'
import makeResolvers from './makeResolvers'

export default function connectFirestore(
  db: firestore.Firestore,
  schema?: DocumentNode
): SchemaqlFactory {
  return (client) => {
    const ourSchema: (DocumentNode | undefined)[] = [SCHEMA, schema]
    const theirSchema = merge(schema, client.schema)
    const targetTypes = getTypes(theirSchema).filter(getDirective('firestore'))
    const queries: Schemaql['queries'] = {}
    targetTypes.forEach((type) => {
      Object.assign(queries, makeResolvers(type))
      ourSchema.push(makeOperations(type))
    })
    const scalars = {
      JSON: GraphQLJSON,
    }
    const context = makeContext(merge(...ourSchema))
    return {
      schema: merge(...ourSchema),
      scalars,
      queries,
      context,
    }
  }
}
