import { GraphQLSchema } from 'graphql'
import buildState from './buildState'
import buildSchema from './buildSchema'
import buildResolvers from './buildResolvers'

const DIRECTIVE_NAME = 'state'

export default function browserqlStatePlugin() {
  return function (schema: GraphQLSchema) {
    const directiveName = DIRECTIVE_NAME
    const state = buildState(schema, directiveName)
    const pluginSchema = buildSchema(state)
    const pluginResolvers = buildResolvers(state)
    return {
      schema: pluginSchema,
      resolvers: pluginResolvers,
      context: { state }
    }
  }
}
