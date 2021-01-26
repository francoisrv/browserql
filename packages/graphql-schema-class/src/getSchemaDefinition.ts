import { getInput, getType } from '@browserql/fpql'
import {
  DocumentNode,
  InputObjectTypeDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql'

export default function getSchemaDefinition(
  schema: DocumentNode,
  identifier: { type: string } | { input: string } | Record<string, never>
): ObjectTypeDefinitionNode | InputObjectTypeDefinitionNode {
  if ('type' in identifier) {
    const type = getType(identifier.type)(schema)

    if (!type) {
      throw new Error(`Could not find type ${identifier.type} in schema`)
    }

    return type as ObjectTypeDefinitionNode
  }

  if (identifier.input) {
    const input = getInput(identifier.input)(schema)

    if (!input) {
      throw new Error(`Could not find input ${identifier.input} in schema`)
    }

    return input as InputObjectTypeDefinitionNode
  }

  const [type] = schema.definitions

  if (type.kind === 'ObjectTypeDefinition') {
    return type as ObjectTypeDefinitionNode
  }

  if (type.kind === 'InputObjectTypeDefinition') {
    return type as InputObjectTypeDefinitionNode
  }

  throw new Error(
    `Was expecting an Object Type or an Input Object, instead got ${type.kind}`
  )
}
