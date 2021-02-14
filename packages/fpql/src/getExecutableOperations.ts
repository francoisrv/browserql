import type { DocumentNode, OperationDefinitionNode } from 'graphql'

export default function getExecutableOperations(
  schema: DocumentNode
): OperationDefinitionNode[] {
  const operations = schema.definitions.filter(
    (def) =>
      def.kind === 'OperationDefinition' &&
      def.operation &&
      (def.operation === 'query' ||
        def.operation === 'mutation' ||
        def.operation === 'subscription')
  ) as OperationDefinitionNode[]
  return operations
}
