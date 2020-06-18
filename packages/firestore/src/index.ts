import { Plugin } from '@browserql/client'
import buildSchema from './buildSchema'
import buildMutations from './buildMutations'

export default function plugin(db: any): Plugin {
  return function(ctx) {
    buildSchema(ctx.schema)
    buildMutations(ctx.schema, ctx.mutations, ctx.getClient, db)
    return {}
  }
}

export * from './utils'
