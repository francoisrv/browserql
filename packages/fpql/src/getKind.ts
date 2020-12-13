import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  TypeNode,
} from 'graphql'
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
  return findKind(def.type)
}
