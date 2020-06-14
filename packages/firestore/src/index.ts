import { Plugin } from '@browserql/client'
import buildResolvers from './buildResolvers'
import buildSchema from './buildSchema'

export default function plugin(db: any) {
  return function(...args: Parameters<Plugin>): ReturnType<Plugin> {
    const [schema, resolvers, getClient] = args
    buildSchema(schema)
    buildResolvers(schema, resolvers, getClient, db)
    return {}
  }
}