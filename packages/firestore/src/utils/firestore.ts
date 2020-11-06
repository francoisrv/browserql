import { firestore } from 'firebase'
import { isNumber, pick } from 'lodash'
import type { Query, QueryFilters } from '../types'

const operators = {
  equals: '==',
  isIn: 'in',
}

function formatWhere(
  field: string,
  options: { operator?: string; value?: any } = {}
) {
  let Field: any = field
  const { operator = 'equals', value } = options
  if (field === 'id' && operator === 'isIn') {
    Field = firestore.FieldPath.documentId()
  }
  return [Field, operators[operator as keyof typeof operators] || '==', value]
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
          const [field, operator, value] = formatWhere(
            q.field,
            pick(q, ['operator', 'value'])
          )
          // @ts-ignore
          query = query.where(field, operator, value)
        }
      } else {
        const [field, operator, value] = formatWhere(
          where.field,
          pick(where, ['operator', 'value'])
        )
        // @ts-ignore
        query = query.where(field, operator, value)
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
