import { Plugin } from '@browserql/client'

import buildState from './buildState'
import buildSchema from './buildSchema'
import buildQueries from './buildQueries'
import buildMutations from './buildMutations'

const DIRECTIVE_NAME = 'state'

export default function browserqlStatePlugin(): Plugin {
  return function (ctx) {
    const directiveName = DIRECTIVE_NAME
    const state = buildState(ctx.schema, directiveName)
    buildSchema(state, ctx.schema)
    buildQueries(state, ctx.schema, ctx.queries, ctx.getClient)
    buildMutations(state, ctx.schema, ctx.mutations, ctx.getClient)
    return {}
  }
}
