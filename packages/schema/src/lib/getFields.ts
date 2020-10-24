import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from 'graphql';

export default function getFields(type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode) {
  const { fields = [] } = type
  return fields
}