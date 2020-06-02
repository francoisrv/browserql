import { GraphQLOutputType, isNonNullType, isListType } from 'graphql'

export default function printType(type: GraphQLOutputType): string {
  if (isNonNullType(type)) {
    return `${ printType(type.ofType) } !`
  }
  if (isListType(type)) {
    return `[ ${ printType(type.ofType) } ]`
  }
  return type.name
}