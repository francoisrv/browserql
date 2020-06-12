import { Resolver, Schema } from '@browserql/client'

export default function buildResolvers(schema: Schema, resolvers: any, db: any) {
  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    let collectionName = typeName?.toLowerCase()
    if (/y$/.test(typeName)) {
      collectionName = collectionName?.replace(/y$/, 'ies')
    } else {
      collectionName += 's'
    }
    const findName = `firestoreFind${ typeName }`
    resolvers[findName] = new Resolver(findName)
    resolvers[findName].push(async (input: any) => {
      const querySnapshot = await db.collection(collectionName).get()
      const results = []
      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return results
    })
    const findOneName = `firestoreFindOne${ typeName }`
  }
}
