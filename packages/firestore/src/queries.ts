import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { isNumber } from 'lodash'
import { Query, QueryFilters, QueryOperator } from './types'

const db = firebase.firestore()

const operators = {
  equals: '=='
}

function makeQuery(collection: string, where?: Query[], filters?: QueryFilters) {
  let query = db.collection(collection)
  if (where) {
    for (const q of where) {
      // @ts-ignore
      query = query.where(q.field, operators[q.operator] || '==', q.value)
    }
  }
  if (filters) {
    if (isNumber(filters.size)) {
      // @ts-ignore
      query = query.limit(filters.size as number)
    }
    if (filters.orderBy) {
      // @ts-ignore
      query = query.orderBy(filters.orderBy)
    }
  }
  return query
}

export async function paginate(collection: string, where?: Query[], filters?: QueryFilters) {
  const query = makeQuery(collection, where, filters)
  const querySnapshot = await query.get()
  const docs: any[] = []
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() })
  })
  return docs
}

export async function getOne(collection: string, where?: Query[], filters?: QueryFilters) {
  const query = makeQuery(collection, where, filters)
  query.limit(1)
  const querySnapshot = await query.get()
  let doc: any
  querySnapshot.forEach((d) => {
    if (!doc) {
      doc = d
    }
  })
  return { id: doc.id, ...doc.data() }
}

export async function getById(collectionName: string, id: string){
  const collection = db.collection(collectionName)
  const doc = await collection.doc(id).get()
  return { id: doc.id, ...doc.data() }
}
