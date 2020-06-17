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
  for (const k in where) {
    if ('equals' in where[k]) {
      query = query.where(k, '==', where[k].equals)
    }
  }
  return query
}

function buildDocument(doc: any, typeName: string) {
  return {
    id: doc.id,
    __typename: typeName,
    ...doc.data()
  }
}

function buildDocuments(snapshot: any, typeName: string) {
  const docs: any[] = []
  snapshot.forEach((doc: any) => {
    docs.push(buildDocument(doc, typeName))
  })
  return docs
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
    if (options.input.id) {
      const docRef = db.collection(options.collectionName).doc(options.input.id)
      docRef.onSnapshot((doc: any) => {
        const client = getClient()
        const nextData = buildDocument(doc, options.typeName)
        client.writeQuery(options.queryName, nextData, options.input)
      })
      const doc = await docRef.get()
      return buildDocument(doc, options.typeName)
    }
    
    let docRef = db.collection(options.collectionName)
    
    if (options.input.where) {
      docRef = buildWhereQuery(options.input.where, docRef)
    }

    docRef.onSnapshot((querySnapshot: any) => {
      const client = getClient()
      const nextData = buildDocuments(querySnapshot, options.typeName)
      client.writeQuery(options.queryName, nextData, options.input)
    })

    const querySnapshot = await docRef.get()
    const results = buildDocuments(querySnapshot, options.typeName)

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
