import {
  getDirective,
  getKind,
  getName,
  getTypes,
  parseKind,
} from '@browserql/fpql'
import type { BrowserqlClient } from '@browserql/types'
import type { DocumentNode } from 'graphql'
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
  const { schema } = client
  const types = getTypes(schema as DocumentNode)
  const typesWithState = types.filter(getDirective('state'))
  const state: State = {}
  typesWithState.forEach((type) => {
    const typeName = getName(type)
    state[typeName] = {}
    const { fields = [] } = type
    fields.forEach((field) => {
      const kind = parseKind(getKind(field))
      const fieldName = getName(field)
      state[typeName][fieldName] = {
        get() {
          return get(client, typeName, field)
        },
        set(data: any) {
          return set(client, typeName, fieldName, data)
        },
      }
    })
  })
  return state
}
