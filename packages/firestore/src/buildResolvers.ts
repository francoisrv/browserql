import { Resolver, Schema, Client } from '@browserql/client'

export default function buildResolvers(schema: Schema, resolvers: any, getClient: () => Client, db: any) {
  const types = schema.getTypesWithDirective('firestore')

  const client = getClient()

  for (const type of types) {
    const typeName = Schema.getName(type)
    if (!typeName) {
      throw new Error('Could not get name')
    }
    let collectionName = typeName?.toLowerCase()
    if (/y$/.test(typeName)) {
      collectionName = collectionName?.replace(/y$/, 'ies')
    } else {
      collectionName += 's'
    }
    
    const findName = `firestoreFind${ typeName }`
    resolvers[findName] = new Resolver(findName, getClient)
    resolvers[findName].push(async (input: any) => {
      try {
        return client.read(findName)
      } catch (error) {
        const querySnapshot = await db.collection(collectionName).get()
        const results: any[] = []
        querySnapshot.forEach((doc: any) => {
          results.push({
            id: doc.id,
            ...doc.data()
          })
        })
        return results
      }
    })
    
    const findOneName = `firestoreFindOne${ typeName }`
    resolvers[findOneName] = new Resolver(findOneName, getClient)
    resolvers[findOneName].push(async (input: any) => {
      let query = await db.collection(collectionName)
      for (const k in input) {
        query = query.where(k, '==', input[k])
      }
      const querySnapshot = await query.get()
      const results: any[] = []
      querySnapshot.forEach((doc: any) => {
        results.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return results[0]
    })

    const findById = `firestoreFindById${ typeName }`
    resolvers[findById] = new Resolver(findById, getClient)
    resolvers[findById].push(async (p: { id: string }) => {
      const doc = await db.collection(collectionName).doc(p.id).get()
      if (doc.exists) {
        return {
          id: p.id,
          ...doc.data()
        }
      }
    })
  }
}
