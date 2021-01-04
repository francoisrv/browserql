import type { DocumentNode, OperationDefinitionNode } from 'graphql'

export default function getExecutableOperations(
  schema: DocumentNode
): OperationDefinitionNode[] {
  const operations = schema.definitions.filter(
    (def) =>
      def.kind === 'OperationDefinition' &&
      def.operation &&
      (def.operation === 'query' || def.operation === 'mutation')
  ) as OperationDefinitionNode[]
  return operations
}
