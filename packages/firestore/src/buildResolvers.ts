import { Schema } from '@browserql/client'

export default function buildResolvers(schema: Schema) {
  const resolvers: any = {}

  // const types = getTypesWithDirective(schema, 'firestore')

  // for (const type of types) {
  //   const typeName = getName(type)
  //   const findName = `firestoreFind${ typeName }`
  //   resolvers[findName] = async () => {

  //   }
  // }

  return resolvers
}