import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from 'graphql';
import { getName } from '..';

export default function getField(type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode, fieldName: string) {
  const { fields = [] } = type
  return fields.find(field => getName(field) === fieldName)
}

getField.fp = (name: Parameters<typeof getField>[1]) => {
  return (field: Parameters<typeof getField>[0]) => getField(field, name)
}