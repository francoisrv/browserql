import { Schema, Mutation, Client } from '@browserql/client'
import { Dictionary } from 'lodash'
import getCollectionName from './getCollectionName'
import { FIND_QUERY, FIND_ONE_QUERY, FIND_BY_ID_QUERY } from './utils'
import { Input } from './types'

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

export default function buildMutations(
  schema: Schema,
  mutations: Dictionary<Mutation>,
  getClient: () => Client,
  db: any
) {
  const types = schema.getTypesWithDirective('firestore')

  function addMutation(
    queryName: string,
    cb: (input: Input) => Promise<any>
  ) {
    mutations[queryName] = new Mutation(queryName, getClient).push(cb)
  }

  async function find(options: FindOptions) {
    if (options.input.id) {
      const docRef = db.collection(options.collectionName).doc(options.input.id)
      docRef.onSnapshot((doc: any) => {
        const client = getClient()
        const nextData = buildDocument(doc, options.typeName)
        client.write(options.queryName, nextData, options.input)
      })
      const doc = await docRef.get()
      return buildDocument(doc, options.typeName)
    }
    
    let docRef = db.collection(options.collectionName)
    
    if (options.input.where) {
      docRef = buildWhereQuery(options.input.where, docRef)
    }

    const client = getClient()

    docRef.onSnapshot((querySnapshot: any) => {
      const nextData = buildDocuments(querySnapshot, options.typeName)
      client.write(options.queryName, nextData, options.input)
    })

    const querySnapshot = await docRef.get()
    const results = buildDocuments(querySnapshot, options.typeName)

    if (options.single) {
      client.write(options.queryName, results[0], options.input)
    } else {
      client.write(options.queryName, results, options.input)
    }
  }

  for (const type of types) {
    const typeName = Schema.getName(type)
    const collectionName = getCollectionName(type)

    const FIND = FIND_QUERY(typeName, 'Mutation')
    const FIND_ONE = FIND_ONE_QUERY(typeName, 'Mutation')
    const FIND_BY_ID = FIND_BY_ID_QUERY(typeName, 'Mutation')

    addMutation(FIND, async input => {
      return await find({
        collectionName,
        input,
        typeName,
        queryName: FIND
      })
    })

    addMutation(FIND_ONE, async input => {
      return await find({
        collectionName,
        input,
        typeName,
        queryName: FIND_ONE,
        single: true
      })
    })

    addMutation(FIND_BY_ID, async input => {
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
