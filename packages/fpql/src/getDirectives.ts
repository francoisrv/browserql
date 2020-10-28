import {
  DirectiveDefinitionNode,
  DirectiveNode,
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'

export default function getDirectives(
  document: DocumentNode
): DirectiveDefinitionNode[]

export default function getDirectives(
  type: FieldDefinitionNode | ObjectTypeDefinitionNode | ObjectTypeExtensionNode
): DirectiveNode[]

export default function getDirectives(
  document:
    | DocumentNode
    | FieldDefinitionNode
    | ObjectTypeDefinitionNode
    | ObjectTypeExtensionNode
): (DirectiveNode | DirectiveDefinitionNode)[] {
  if ('definitions' in document) {
    const { definitions } = document
    const next = definitions.filter((def) => def.kind === 'DirectiveDefinition')
    return next as DirectiveDefinitionNode[]
  }
  const { directives = [] } = document
  return directives as DirectiveNode[]
}
