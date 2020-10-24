import { ObjectTypeDefinitionNode } from 'graphql'

export default function getFields(type: ObjectTypeDefinitionNode) {
  const { fields = [] } = type
  return fields
}