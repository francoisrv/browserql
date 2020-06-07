import { Plugin } from '@browserql/client'
import buildResolvers from './buildResolvers'
import buildSchema from './buildSchema'

interface PluginProps {}

export default function plugin(props?: PluginProps) {
  return function(...args: Parameters<Plugin>): ReturnType<Plugin> {
    const [schema] = args
    return {
      schema: buildSchema(schema),
      resolvers: buildResolvers(schema)
    }
  }
}