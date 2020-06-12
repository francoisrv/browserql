import { TypeNode } from 'graphql'
import { Schema } from '@browserql/client'

export function setNonNullInitialState(type: TypeNode): any {
  if (type.kind === 'NonNullType') {
    return setNonNullInitialState(type.type)
  }
  if (type.kind === 'ListType') {
    return []
  }
  
  if (type.kind === 'NamedType') {
    switch (Schema.printEndType(type)) {
      case 'String': return ''
      case 'Int': return 0
      case 'Float': return 0
      case 'Boolean': return true
    }
  }
  return null
}

export function setInitialState(type: TypeNode) {
  if (type.kind === 'NonNullType') {
    return setNonNullInitialState(type.type)
  }
  return null
}