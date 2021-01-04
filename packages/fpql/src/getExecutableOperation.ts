import { DocumentNode } from 'graphql'
import getName from './getName'
import getExecutableOperations from './getExecutableOperations'

export default function getExecutableOperation(name: string) {
  return (schema: DocumentNode) =>
    getExecutableOperations(schema).find(
      (operation) => getName(operation) === name
    )
}
