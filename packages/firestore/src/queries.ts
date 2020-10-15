import type { BrowserqlContext, BrowserqlClient } from '@browserql/types'

import * as firebase from 'firebase/app'
import 'firebase/firestore'
import gql from 'graphql-tag'
import { isNumber } from 'lodash'
import buildFragments from '../../fragments/dist'

import type { Query, QueryFilters } from './types'

const db = firebase.firestore()

const operators = {
  equals: '=='
}

function makeQuery(collection: string, where?: Query | Query[], filters?: QueryFilters) {

  let query = db.collection(collection)
  if (where) {
    if (Array.isArray(where)) {
      for (const q of where) {
        // @ts-ignore
        query = query.where(q.field, operators[q.operator] || '==', q.value)
      }
    } else {
      // @ts-ignore
      query = query.where(where.field, operators[where.operator] || '==', where.value)
    }
  }
  if (filters) {
    if (isNumber(filters.size)) {
      // @ts-ignore
      query = query.limit(filters.size as number)
    }
    if (filters.orderBy) {
      // @ts-ignore
      query = query.orderBy(filters.orderBy, 'asc')
    }
  }
  return query
}

async function getDocument<A = any>(doc: firebase.firestore.QueryDocumentSnapshot<A>) {
  const pretty: any = {
    id: doc.id || 'xxxxxxxxxxxxxxxxxx',
    ...doc.data()
  }
  for (const a in pretty) {
    if (
      (pretty[a].constructor.name === 'n' || pretty[a].constructor.name === 'r') && (
        typeof pretty[a] === 'object' &&
        pretty[a] !== null &&
        'get' in pretty[a]
      )) {
      const res = await pretty[a].get()
      pretty[a] = await getDocument(res)
    }
  }
  return pretty
}

export interface PaginateProps {
  collection: string
  type: string
  where?: Query | Query[]
  filters?: QueryFilters
}

export async function paginate(props: PaginateProps, client: BrowserqlClient) {
  const query = makeQuery(props.collection, props.where, props.filters)
  let resolved = false
  return new Promise((resolve, reject) => {
    query.onSnapshot(async querySnapshot => {
      const docs: any[] = []
      querySnapshot.forEach(async (doc) => {
        docs.push(doc)
      })
      const documents = await Promise.all(docs.map(getDocument))
      if (!resolved) {
        resolved = true
        resolve(documents)
      } else {
        const fragments = buildFragments(client.schema)
        documents.forEach(doc => {
          client.apollo.cache.writeFragment({
            id: doc.id,
            fragment: gql(fragments.get(props.type) as string),
            data: doc,
          })
        })
      }
    })
  })
}

export async function getOne(collection: string, where?: Query | Query[], filters?: QueryFilters) {
  const query = makeQuery(collection, where, filters)
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

export async function getById(collectionName: string, id: string){
  const collection = db.collection(collectionName)
  const doc = await collection.doc(id).get()
  return await getDocument(doc)
}

export async function addOne() {}

export async function addMany() {}

export async function deleteOne() {}

export async function deleteMany() {}

export async function updateOne() {}

export async function updateMany() {}
