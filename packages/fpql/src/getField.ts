import type {
  InputObjectTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'

import getFields from './getFields'
import getName from './getName'

export default function getField(name: string) {
  return (
    type:
      | ObjectTypeDefinitionNode
      | ObjectTypeExtensionNode
      | InputObjectTypeDefinitionNode
  ) => getFields(type).find((field) => getName(field) === name)
}
