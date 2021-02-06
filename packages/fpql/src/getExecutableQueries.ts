import type { DocumentNode, SelectionNode } from 'graphql'
import getExecutableOperations from './getExecutableOperations'

export default function getExecutableQueries(
  schema: DocumentNode
): SelectionNode[] {
  const operations = getExecutableOperations(schema)
  const queries: SelectionNode[] = []
  operations.forEach((operation) => {
    const { selections } = operation.selectionSet
    selections.forEach((selection) => {
      queries.push(selection)
    })
  })
  return queries
}
