import { GraphQLObjectType } from 'graphql'
import { find } from 'lodash'

export default function hasDirective(type: GraphQLObjectType, directiveName: string) {
  if (type.astNode) {
    if (Array.isArray(type.astNode.directives)) {
      const stateDirective = find(type.astNode.directives, d => d.name.value === directiveName)
      return Boolean(stateDirective)
    }
  }
  return false
}
