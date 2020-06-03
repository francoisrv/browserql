import { GraphQLObjectType } from 'graphql'

export default function getName(of: GraphQLObjectType) {
  return of.name
}
