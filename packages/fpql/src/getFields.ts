import {
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql'

export default function getFields(
  type:
    | ObjectTypeDefinitionNode
    | ObjectTypeExtensionNode
    | InputObjectTypeDefinitionNode
) {
  const { fields = [] } = type
  return fields
}
