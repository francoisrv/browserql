import { State } from './types'
import getTypesWithDirectives from '@browserql/utils/dist/getTypesWithDirectives'
import { GraphQLSchema } from 'graphql'
import getName from '@browserql/utils/dist/getName'

export default function buildState(schema: GraphQLSchema, directiveName: string) {
  const state: State = {}

  const types = getTypesWithDirectives(schema, directiveName)

  for (const type of types) {
    const typeName = getName(type)
    state[typeName] = {}
    const fields = type.getFields()
    for (const fieldName in fields) {
      const field = fields[fieldName]
      state[name][fieldName] = {
        field,
        value: setDefaultValue(field, setInitialValue(field.type))
      }
    }
  }

  return state
}
