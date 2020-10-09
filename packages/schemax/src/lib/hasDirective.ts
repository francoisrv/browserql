import { FieldDefinitionNode, OperationDefinitionNode } from 'graphql'
import { getName } from '..'

export default function hasDirective(
  node: FieldDefinitionNode | OperationDefinitionNode,
  name: string
) {
  const { directives = [] } = node
  return directives.some((directive) => getName(directive) === name)
}
