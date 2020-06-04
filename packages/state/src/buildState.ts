import { State } from './types'
import { getTypesWithDirective, getName } from '@browserql/utils'
import { GraphQLSchema } from 'graphql'
import setDefaultState from './setDefaultState'
import { setInitialState } from './setInitialState'

export default function buildState(schema: GraphQLSchema, directiveName: string) {
  const state: State = {}

  const types = getTypesWithDirective(schema, directiveName)

  for (const type of types) {
    const typeName = getName(type)
    state[typeName] = {}
    const fields = type.getFields()
    for (const fieldName in fields) {
      const field = fields[fieldName]
      state[name][fieldName] = {
        field,
        value: setDefaultState(field, setInitialState(field.type))
      }
    }
  }

  return state
}
