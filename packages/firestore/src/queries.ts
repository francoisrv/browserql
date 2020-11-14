// import firebase from 'firebase/app'
// import 'firebase/firestore'

import { firestore } from 'firebase'
import type { Query, QueryFilters, Transformer } from './types'
import {
  getDocument,
  getDocuments,
  makeFirestoreQuery,
} from './utils/firestore'
import { parseInput } from './utils/graphql'

// const db = firebase.firestore()

export interface PaginateProps {
  collection: string
  where?: Query | Query[]
  filters?: QueryFilters
}

export async function paginate<D = unknown>(
  db: firestore.Firestore,
  props: PaginateProps,
  onSnapshot?: (documents: D[]) => void
): Promise<D[]> {
  const query = makeFirestoreQuery(
    props.collection,
    props.where,
    props.filters
  )(db)

  if (onSnapshot) {
    let resolved = false
    return new Promise((resolve) => {
      query.onSnapshot(async (snapshot) => {
        const documents = await getDocuments<D>(snapshot)
        if (!resolved) {
          resolved = true
          resolve(documents)
        } else {
          onSnapshot(documents)
        }
      })
    })
  } else {
    const snapshot = await query.get()
    return await getDocuments<D>(snapshot)
  }
}

export async function getOne(
  db: firestore.Firestore,
  collection: string,
  where?: Query | Query[],
  filters?: QueryFilters
) {
  const query = makeFirestoreQuery(collection, where, filters)(db)
  query.limit(1)
  const querySnapshot = await query.get()
  let doc: any
  querySnapshot.forEach((d) => {
    if (!doc) {
      doc = d
    }
  })
  return await getDocument(doc)
}

export async function getById(
  db: firestore.Firestore,
  collectionName: string,
  id: string
) {
  const collection = db.collection(collectionName)
  const doc = await collection.doc(id).get()
  return await getDocument(doc)
}

export async function addOne(
  db: firestore.Firestore,
  collectionName: string,
  input: any
) {
  const doc = await db.collection(collectionName).add(input)
  return await getById(db, collectionName, doc.id)
}

export async function addMany() {}

export async function deleteOne() {}

export async function deleteMany() {}

export async function updateById(
  db: firestore.Firestore,
  collectionName: string,
  id: string,
  transformers: Transformer[]
) {
  await db
    .collection(collectionName)
    .doc(id)
    .update(
      transformers.reduce(
        (query, transformer) => ({
          ...query,
          [transformer.field]: transformer.value,
        }),
        {}
      )
    )
  return await getById(db, collectionName, id)
}

export async function updateMany() {}
