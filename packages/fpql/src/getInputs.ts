import {
  DocumentNode,
  InputObjectTypeDefinitionNode,
  InputObjectTypeExtensionNode,
} from 'graphql'

export default function getInputs(document: DocumentNode) {
  const { definitions } = document
  const next = definitions.filter(
    (def) =>
      def.kind === 'InputObjectTypeDefinition' ||
      def.kind === 'InputObjectTypeExtension'
  )
  return next as Array<
    InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode
  >
}
