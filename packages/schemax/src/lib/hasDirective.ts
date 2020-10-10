import { FieldDefinitionNode, FragmentDefinitionNode, ObjectTypeDefinitionNode, OperationDefinitionNode } from 'graphql'
import { getName } from '..'

export default function hasDirective(
  node: FieldDefinitionNode | OperationDefinitionNode | FragmentDefinitionNode | ObjectTypeDefinitionNode,
  name: string
) {
  const { directives = [] } = node
  return directives.some((directive) => getName(directive) === name)
}
