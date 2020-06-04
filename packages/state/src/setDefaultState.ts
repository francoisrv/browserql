import { GraphQLField } from 'graphql'
import find from 'lodash.find'

export default function setDefaultState(field: GraphQLField<any, any>, fallback: any) {
  const { astNode } = field
  if (astNode) {
    if (astNode.directives) {
      const defaultDirective = find(astNode.directives, directive => directive.name.value === 'default')
      if (defaultDirective && Array.isArray(defaultDirective.arguments) && defaultDirective.arguments.length) {
        return defaultDirective.arguments[0].value.value
      }
    }
  }
  return fallback
}