import {
  DocumentNode,
  EnumTypeDefinitionNode,
  EnumTypeExtensionNode,
} from 'graphql'
import getName from './getName'

type Kinds = Array<EnumTypeDefinitionNode | EnumTypeExtensionNode>

export default function getEnumerations(document: DocumentNode): Kinds {
  const { definitions } = document
  const next = definitions
    .filter(
      (def) =>
        def.kind === 'EnumTypeDefinition' || def.kind === 'EnumTypeExtension'
    )
    .filter((def) => getName(def) !== 'Query' && getName(def) !== 'Mutation')
  return next as Kinds
}
