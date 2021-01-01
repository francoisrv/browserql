import { getDirective, getField, getName, getTypes } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import cacheql from '@browserql/cache'

class A {}
class B {}
class C extends A implements B {}

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
          return 0
        },
      },
    },
  }
}
