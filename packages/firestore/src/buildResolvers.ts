import { Resolver, Schema, Client } from '@browserql/client'
import { Input } from './types'
import { FIND_QUERY, FIND_ONE_QUERY, FIND_BY_ID_QUERY } from './utils'

interface FindOptions {
  collectionName: string
  input: Input
  typeName: string
  queryName: string
  single?: boolean
}

function buildWhereQuery(where: { [field: string]: any }, query: any) {
  console.log({where})
  for (const k in where) {
    if (where[k].equals) {
      query = query.where(k, '==', where[k].equals)
    }
  }
}

export default function buildResolvers(schema: Schema, resolvers: any, getClient: () => Client, db: any) {
  const types = schema.getTypesWithDirective('firestore')

  function addResolver(
    queryName: string,
    cb: (input: Input) => Promise<any>
  ) {
    resolvers[queryName] = new Resolver(queryName, getClient)
    resolvers[queryName].push(cb)
  }

  async function find(options: FindOptions) {
    let query = await db.collection(options.collectionName)
    
    if (options.input.where) {
      buildWhereQuery(options.input.where, query)
    } else if (options.input.id) {
      query = query.doc(options.input.id)
    }

    query.onSnapshot((querySnapshot: any) => {
      const client = getClient()
      const results2: any[] = []
      querySnapshot.forEach((doc: any) => {
        results2.push({
          __typename: options.typeName,
          id: doc.id,
          ...doc.data()
        })
      })
      client.writeQuery(options.queryName, results2, options.input)
    })

    const querySnapshot = await query.get()
    const results: any[] = []
    querySnapshot.forEach((doc: any) => {
      results.push({
        id: doc.id,
        __typename: options.typeName,
        ...doc.data()
      })
    })

    if (options.single) {
      return results[0]
    }
    return results
  }

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

    const FIND = FIND_QUERY(typeName)
    const FIND_ONE = FIND_ONE_QUERY(typeName)
    const FIND_BY_ID = FIND_BY_ID_QUERY(typeName)
    
    addResolver(FIND, async input => {
      return await find({
        collectionName,
        input,
        typeName,
        queryName: FIND
      })
    })

    addResolver(FIND_ONE, async input => {
      return await find({
        collectionName,
        input,
        typeName,
        queryName: FIND_ONE,
        single: true
      })
    })

    addResolver(FIND_BY_ID, async input => {
      return await find({
        collectionName,
        input,
        typeName,
        queryName: FIND_BY_ID,
        single: true
      })
    })
  }
}
