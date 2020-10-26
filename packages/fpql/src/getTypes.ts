import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'
import getName from './getName'

export default function getTypes(
  document: DocumentNode
): Array<ObjectTypeDefinitionNode | ObjectTypeExtensionNode> {
  const { definitions } = document
  const next = definitions
    .filter(
      (def) =>
        def.kind === 'ObjectTypeDefinition' ||
        def.kind === 'ObjectTypeExtension'
    )
    .filter((def) => getName(def) !== 'Query' && getName(def) !== 'Mutation')
  return next as ObjectTypeDefinitionNode[]
}
