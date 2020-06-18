import { Plugin } from '@browserql/client'
import buildSchema from './buildSchema'
import buildMutations from './buildMutations'
import buildQueries from './buildQueries'

export default function plugin(db: any): Plugin {
  return function(ctx) {
    buildSchema(ctx.schema)
    buildMutations(ctx.schema, ctx.mutations, ctx.getClient, db)
    buildQueries(ctx.schema, ctx.mutations, ctx.getClient)
    return {}
  }
}

export * from './utils'
