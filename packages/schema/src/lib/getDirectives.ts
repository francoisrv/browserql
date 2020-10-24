import { DirectiveDefinitionNode, DirectiveNode, DocumentNode, FieldDefinitionNode } from 'graphql'

export default function getDirectives(document: DocumentNode): DirectiveDefinitionNode[] 

export default function getDirectives(type: FieldDefinitionNode): DirectiveNode[]

export default function getDirectives(document: DocumentNode | FieldDefinitionNode): (DirectiveNode | DirectiveDefinitionNode)[] {
  if ('definitions' in document) {
    const { definitions } = document
    const next = definitions
      .filter((def) => def.kind === 'DirectiveDefinition')
    return next as DirectiveDefinitionNode[]
  }
  const { directives = [] } = document
  return directives as DirectiveNode[]
}
