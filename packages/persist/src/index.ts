import gql from 'graphql-tag'

import { Plugin } from '@browserql/client'

interface PluginProps {}

export default function plugin(props?: PluginProps) {
  return function(...args: Parameters<Plugin>): ReturnType<Plugin> {
    const directive = `directive @persist on FIELD_DEFINITION`
    const pluginSchema = gql`${ directive }`
    return {
      schema: pluginSchema
    }
  }
}