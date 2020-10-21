import type { DocumentNode } from 'graphql'
import type { Schemaql, SchemaqlFactory } from '@browserql/types'

import enhanceSchema, { hasDirective } from '@browserql/schema'
import GraphQLJSON from 'graphql-type-json'
import { mergeTypeDefs } from '@graphql-tools/merge'

import SCHEMA from './schema'
import makeContext from './makeContext'
import makeOperations from './makeOperations'
import makeResolvers from './makeResolvers'

export default function connectFirestore(options: Schemaql = {}): SchemaqlFactory {
  return function (schemaql: Schemaql) {
    const typeDefs: Array<DocumentNode | string> = []
    const nextTypeDefs: Array<DocumentNode | string> = [SCHEMA]

    if (options.schema) {
      typeDefs.push(options.schema)
      nextTypeDefs.push(options.schema)
    }
    if (schemaql.schema) {
      typeDefs.push(schemaql.schema)
    }

    const schema = enhanceSchema(mergeTypeDefs(typeDefs))

    const targetTypes = schema.getTypes().filter(type => hasDirective(type, 'firestore'))

    const queries: Schemaql['queries'] = {}

    targetTypes.forEach(type => {
      Object.assign(queries, makeResolvers(type))

      nextTypeDefs.push(makeOperations(type))
    })

    const scalars = {
      JSON: GraphQLJSON,
    }

    const merged = mergeTypeDefs(nextTypeDefs)

    const context = makeContext(merged)

    return {
      schema: merged,
      queries,
      scalars,
      context,
    }
  }
}
