import getTypes from './getTypes'
import { GraphQLSchema } from 'graphql'
import hasDirective from './hasDirective'

export default function getTypesWithDirectives(
  schema: GraphQLSchema,
  directiveName: string
) {
  const types = getTypes(schema)
  return types.filter(type => hasDirective(type, directiveName))
}
