import { DocumentNode, ScalarTypeDefinitionNode } from 'graphql'

export default function getScalars(
  schema: DocumentNode
): ScalarTypeDefinitionNode[] {
  return schema.definitions.filter(
    (definition) => definition.kind === 'ScalarTypeDefinition'
  ) as ScalarTypeDefinitionNode[]
}
