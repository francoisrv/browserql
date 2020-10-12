import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Query } from './types'

const db = firebase.firestore()

function makeWhereQuery(query: any, where: Query[]) {

}

export async function paginate(collectionName: string, where?: Query[]) {
  let query = db.collection(collectionName)
  if (where) {
    makeWhereQuery(query, where)
  }
  const querySnapshot = await query.get()
  const docs: any[] = []
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() })
  })
  return docs
}

export async function getOne(collectionName: string, where?: Query[]) {
  const collection = db.collection(collectionName)
  let query = collection
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
