import { Schema } from '@browserql/client'

import buildState from './buildState'
import buildSchema from './buildSchema'
import buildResolvers from './buildResolvers'

const DIRECTIVE_NAME = 'state'

export default function browserqlStatePlugin() {
  return function (schema: Schema, rootValue: any, getClient: any) {
    const directiveName = DIRECTIVE_NAME
    const state = buildState(schema, directiveName)
    buildSchema(state, schema)
    buildResolvers(state, schema, rootValue, getClient)
  }
}
