import type { BrowserqlClient } from '@browserql/types'
import enhanceSchema, { getKind, getName, hasDirective, parseKind } from '@browserql/schema'
import { get, set } from './lib'

type Field = {
  get(): any
      set(data: any): any
}

type State = {
  [type: string]: {
    [field: string]: Field
  }
}

export default function makeState(client: BrowserqlClient): State {
  const schema = enhanceSchema(client.schema)
  const types = schema.getTypes()
  const typesWithState = types.filter(type => hasDirective(type, 'state'))
  const state: State = {}
  typesWithState.forEach(type => {
    const typeName = getName(type)
    state[typeName] = {}
    const { fields = [] } = type
    fields.forEach(field => {
      const kind = parseKind(getKind(field))
      const fieldName = getName(field)
      state[typeName][fieldName] = {
        get() {
          return get(typeName, fieldName, kind)
        },
        set(data: any) {
          return set(typeName, fieldName, data)
        }
      }
    })
  })
  return state
}
