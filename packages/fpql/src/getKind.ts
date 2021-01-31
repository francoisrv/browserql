import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  TypeNode,
} from 'graphql'
import getDefaultValue from './getDefaultValue'
import getName from './getName'

function findKind(type: TypeNode): string {
  if (type.kind === 'NamedType') {
    return getName(type) as string
  }
  if (type.kind === 'NonNullType') {
    return `${findKind(type.type)} !`
  }
  if (type.kind === 'ListType') {
    return `[ ${findKind(type.type)} ]`
  }
  return ''
}

function parseValue(value: any): string {
  if (value === null || typeof value === 'undefined') {
    return 'null'
  }
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(value, null, 2)
    case 'object': {
      if (Array.isArray(value)) {
        return value.map(parseValue).join(' ')
      }
      return '{ '
        .concat(
          Object.keys(value)
            .map((key) => `${key}: ${parseValue(value[key])}`)
            .join(' ')
        )
        .concat(' }')
    }
  }
  throw new Error('Can not parse value')
}

export default function getKind(
  def: FieldDefinitionNode | InputValueDefinitionNode
) {
  const kind = findKind(def.type)
  if (def.kind === 'FieldDefinition') {
    return kind
  }
  const defaultValue = getDefaultValue(def)
  if (typeof defaultValue === 'undefined') {
    return kind
  }
  return kind.concat(' = ').concat(parseValue(defaultValue))
}
