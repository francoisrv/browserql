import { Resolver, Schema, Client } from '@browserql/client'

function buildWhereQuery(where: { [field: string]: any }, query: any) {
  for (const k in where) {
    query = query.where(k, '==', where[k])
  }
}

export default function buildResolvers(schema: Schema, resolvers: any, getClient: () => Client, db: any) {
  const types = schema.getTypesWithDirective('firestore')

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
      let query = await db.collection(collectionName)
      if (input.where) {
        buildWhereQuery(input.where, query)
      }
      query.onSnapshot((querySnapshot: any) => {
        const client = getClient()
        const results2: any[] = []
        querySnapshot.forEach((doc: any) => {
          results2.push({
            __typename: typeName,
            id: doc.id,
            ...doc.data()
          })
        })
        client.writeQuery(findName, results2, input)
      })
      const querySnapshot = await query.get()
      const results: any[] = []
      querySnapshot.forEach((doc: any) => {
        results.push({
          id: doc.id,
          __typename: typeName,
          ...doc.data()
        })
      })
      return results
    })
    
    const findOneName = `firestoreFindOne${ typeName }`
    resolvers[findOneName] = new Resolver(findOneName, getClient)
    resolvers[findOneName].push(async (input: any) => {
      let query = await db.collection(collectionName)
      buildWhereQuery(input, query)
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
