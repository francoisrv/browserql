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

export default function getKind(
  def: FieldDefinitionNode | InputValueDefinitionNode
) {
  let kind = findKind(def.type)
  const defaultValue = getDefaultValue(def)
  return typeof defaultValue === 'undefined'
    ? kind
    : `${kind} = ${JSON.stringify(defaultValue)}`
}
