import type {
  DocumentNode,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql'

export default function getExecutableQueries(
  schema: DocumentNode
): SelectionNode[] {
  const operations = schema.definitions.filter(
    (def) =>
      def.kind === 'OperationDefinition' &&
      def.operation &&
      def.operation === 'query'
  ) as OperationDefinitionNode[]
  const queries: SelectionNode[] = []
  operations.forEach((operation) => {
    const { selections } = operation.selectionSet
    selections.forEach((selection) => {
      queries.push(selection)
    })
  })
  return queries
}
