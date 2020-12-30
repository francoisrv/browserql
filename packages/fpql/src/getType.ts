import type {
  DocumentNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'
import getName from './getName'
import getTypes from './getTypes'
import getFields from './getFields'

interface Options {
  includesExtended?: boolean
}

export default function getType(name: string, options: Options = {}) {
  return (
    document: DocumentNode
  ): ObjectTypeDefinitionNode | ObjectTypeExtensionNode | undefined => {
    const types = getTypes(document)
    const matches = types.filter(
      (type): type is ObjectTypeDefinitionNode =>
        getName(type) === name &&
        (type.kind === 'ObjectTypeDefinition' ||
          type.kind === 'ObjectTypeExtension')
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
        // @ts-ignore
        fields: matches.reduce(
          // @ts-ignore
          (all, match) => [...all, ...getFields(match)],
          []
        ),
      }
    }
    return matches[0]
  }
}
