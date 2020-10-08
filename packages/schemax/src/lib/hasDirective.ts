import { FieldDefinitionNode } from 'graphql'
import { getName } from '..'

export default function hasDirective(node: FieldDefinitionNode, name: string) {
  const { directives = [] } = node
  return directives.some((directive) => getName(directive) === name)
}
