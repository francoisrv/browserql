import { GraphQLSchema, isObjectType, GraphQLObjectType } from 'graphql'

export default function getTypes(schema: GraphQLSchema) {
  const results: GraphQLObjectType[] = []
  const types = schema.getTypeMap()
  for (const name in types) {
    const type = types[name]
    if (
      isObjectType(type) &&
      name !== 'Query' &&
      name !== 'Mutation' &&
      !/^__/.test(name)
    ) {
      results.push(type)
    }
  }
  return results
}
