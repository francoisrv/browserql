import { DocumentNode, FieldDefinitionNode, ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from 'graphql'
import getName from './getName'
import getTypes from './getTypes'
import toDocument from './toDocument'

interface Options {
  includesExtended?: boolean
}

export default function getType(
  name: string,
  options: Options = {}
) {
  return (doc: DocumentNode | string): ObjectTypeDefinitionNode | ObjectTypeExtensionNode | undefined => {
    const document = toDocument(doc)
    const types = getTypes(document)
    const matches = types.filter(
      (type): type is ObjectTypeDefinitionNode =>
        getName(type) === name && (
          type.kind === 'ObjectTypeDefinition' ||
          type.kind === 'ObjectTypeExtension'
        )
    )
    if (!matches.length) {
      return undefined
    }
    if (matches.length === 1) {
      return matches[0]
    }
    const { includesExtended = true } = options
    if (includesExtended) {
      return {
        ...matches[0],
        fields: matches.reduce<FieldDefinitionNode[]>(
          (all, match) => [
            ...all,
            ...match.fields,
          ],
          []
        ),
      }
    }
    return matches[0]
  }
}