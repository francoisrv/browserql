import { getDirective, getField, getName, getTypes } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import { buildQuery } from '@browserql/operations'
import cacheql from '@browserql/cache'

export default function buildState(schema: DocumentNode) {
  const types = getTypes(schema)
  const typesWithState = types.filter(getDirective('state'))

  return {
    context: {
      state: {
        get(path: string) {
          const [typeName, fieldName] = path.split(/\./)
          const type = typesWithState.find((type) => getName(type))
          if (!type) {
            return undefined
          }
          const field = getField(fieldName)(type)
          if (!field) {
            return undefined
          }
          const query = buildQuery(schema, getName(field))
          const { get } = cacheql(cache, schema)
          return 0
        },
      },
    },
  }
}
