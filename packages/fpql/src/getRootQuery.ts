import { DocumentNode } from 'graphql'
import getName from './getName'

export default function getRootQuery(document: DocumentNode) {
  const { definitions } = document
  return definitions.find(
    (def) => def.kind === 'ObjectTypeDefinition' && getName(def) === 'Query'
  )
}
