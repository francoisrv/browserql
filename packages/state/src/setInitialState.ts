import { isNonNullType, GraphQLOutputType, isScalarType } from 'graphql'

function setNonNullInitialState(type: GraphQLOutputType): any {
  if (isNonNullType(type)) {
    return setNonNullInitialState(type.ofType)
  }
  if (isScalarType(type)) {
    switch (type.name) {
      case 'String': return ''
      case 'Int': return 0
      case 'Float': return 0
      case 'Boolean': return true
    }
  }
  return null
}

export function setInitialState(type: GraphQLOutputType) {
  if (isNonNullType(type)) {
    return setNonNullInitialState(type.ofType)
  }
  return null
}