import { DocumentNode } from 'graphql'
import getName from './getName'

export default function getRootMutation(document: DocumentNode) {
  const { definitions } = document
  return definitions.find(
    (def) => def.kind === 'ObjectTypeDefinition' && getName(def) === 'Mutation'
  )
}
