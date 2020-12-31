import { getDirective, getField, getName, getTypes } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'

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
          return 0
        },
      },
    },
  }
}
