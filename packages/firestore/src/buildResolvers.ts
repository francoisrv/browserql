import { Resolver, Schema } from '@browserql/client'

export default function buildResolvers(schema: Schema, resolvers: any) {
  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    const findName = `firestoreFind${ typeName }`
    resolvers[findName] = new Resolver(findName)
    resolvers[findName].push(async (input: any) => {
      console.log({input})
      return []
    })
    const findOneName = `firestoreFindOne${ typeName }`
  }
}