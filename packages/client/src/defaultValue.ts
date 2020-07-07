import { TypeNode } from "graphql";

export default function defaultValue(type: TypeNode): any {
  if (type.kind === 'NonNullType') {
    const nested = type.type
    if (nested.kind === 'NamedType') {
      switch (nested.name.value) {
        case 'String': case 'ID': return ''
        case 'Float': case 'Int': return 0
        case 'Boolean': return false
      }
    }
    if (nested.kind === 'ListType') {
      return []
    }
  }
  return null
}
