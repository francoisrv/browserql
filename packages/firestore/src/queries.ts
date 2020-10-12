import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Query, QueryOperator } from './types'

const db = firebase.firestore()

function makeQuery(collection: string, where?: Query[]) {
  let query = db.collection(collection)
  if (where) {
    for (const q of where) {
      // @ts-ignore
      query = query.where(q.field, q.operator, q.value)
    }
  }
  return query
}

export async function paginate(collection: string, where?: Query[]) {
  const query = makeQuery(collection, where)
  const querySnapshot = await query.get()
  const docs: any[] = []
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() })
  })
  return docs
}

export async function getOne(collection: string, where?: Query[]) {
  const query = makeQuery(collection, where)
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
