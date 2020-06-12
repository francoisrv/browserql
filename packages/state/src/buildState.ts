import { Schema } from '@browserql/client'

import { State } from './types'
import setDefaultState from './setDefaultState'
import { setInitialState } from './setInitialState'

export default function buildState(schema: Schema, directiveName: string) {
  const state: State = {}

  const types = schema.getTypesWithDirective(directiveName)

  for (const type of types) {
    const typeName = Schema.getName(type)
    state[typeName] = {}
    const fields = schema.getTypeFields(typeName)
    for (const field of fields) {
      const fieldName = Schema.getName(field)
      state[typeName][fieldName] = {
        field,
        value: setDefaultState(field, setInitialState(field.type))
      }
    }
  }

  return state
}
