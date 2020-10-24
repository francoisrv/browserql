import type { DirectiveDefinitionNode, DirectiveNode, FieldDefinitionNode, GraphQLDirective } from 'graphql'
import { getName } from '..'

export default function parseDirective(
  definition: DirectiveDefinitionNode,
  directive: DirectiveNode,
) {
  const { arguments: defArgs = [] } = definition
  if (!defArgs.length) {
    return {}
  }
  const { arguments: directiveArgs = [] } = directive
  return defArgs.reduce(
    (values, defArg) => {
      const directiveArg = directiveArgs.find(arg => getName(arg) === getName(defArg))
      let value
      if (directiveArg) {
        value = directiveArg.value.value
      }
      return {
        [getName(defArg)]: value,
        ...values,
      }
    },
    {}
  )
}
