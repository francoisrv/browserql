import { Plugin } from '@browserql/client'
import buildResolvers from './buildQueries'
import buildSchema from './buildSchema'

export default function plugin(db: any): Plugin {
  return function(ctx) {
    buildSchema(ctx.schema)
    // buildResolvers(schema, resolvers, getClient, db)
    return {}
  }
}

export * from './utils'
