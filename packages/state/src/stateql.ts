import { getDirective, getField, getName, getTypes } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import { buildQuery } from '@browserql/operations'
import cacheql from '@browserql/cache'
import type { InMemoryCache } from 'apollo-cache-inmemory'

export default function stateql(schema: DocumentNode, cache: InMemoryCache) {
  const types = getTypes(schema)
  const typesWithState = types.filter(getDirective('state'))

  return {
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
      return get(query)
    },
  }
}
