import { firestore } from 'firebase'
import { isNumber } from 'lodash'
import type { Query, QueryFilters } from '../types'

const operators = {
  equals: '==',
}

export function makeFirestoreQuery(
  collection: string,
  where?: Query | Query[],
  filters?: QueryFilters
) {
  return (db: firestore.Firestore) => {
    let query = db.collection(collection)
    if (where) {
      if (Array.isArray(where)) {
        for (const q of where) {
          // @ts-ignore
          query = query.where(q.field, operators[q.operator] || '==', q.value)
        }
      } else {
        // @ts-ignore
        query = query.where(
          where.field,
          // @ts-ignore
          operators[where.operator] || '==',
          where.value
        )
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
}

export async function getDocument<A = any>(
  doc: firebase.firestore.QueryDocumentSnapshot<A>
) {
  const pretty: any = {
    id: doc.id || 'xxxxxxxxxxxxxxxxxx',
    ...doc.data(),
  }
  for (const a in pretty) {
    if (
      (pretty[a].constructor.name === 'n' ||
        pretty[a].constructor.name === 'r') &&
      typeof pretty[a] === 'object' &&
      pretty[a] !== null &&
      'get' in pretty[a]
    ) {
      const res = await pretty[a].get()
      pretty[a] = await getDocument(res)
    }
  }
  return pretty
}

export async function getDocuments<A = unknown>(
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
) {
  const docs: A[] = []
  snapshot.forEach(async (doc) => {
    docs.push(await getDocument(doc))
  })
  return docs
}
