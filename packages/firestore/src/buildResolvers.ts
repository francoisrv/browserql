import { GraphQLSchema } from 'graphql'
import { getTypesWithDirective, getName } from '@browserql/utils'

export default function buildResolvers(schema: GraphQLSchema) {
  const resolvers: any = {}

  const types = getTypesWithDirective(schema, 'firestore')

  for (const type of types) {
    const typeName = getName(type)
    const findName = `firestoreFind${ typeName }`
    resolvers[findName] = async () => {

    }
  }

  return resolvers
}