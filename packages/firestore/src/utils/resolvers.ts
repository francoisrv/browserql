import { getDirective, getName, getTypes } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import type { firestore } from 'firebase'
import { QueryFilters, QueryWhere } from '../types'
import { getDocument, makeFirestoreQuery } from './firestore'

export function makeResolvers(db: firestore.Firestore, schema: DocumentNode) {
  const types = getTypes(schema)
  const firestoreTypes = types.filter(getDirective('firestore'))
  const queries = firestoreTypes.reduce(
    (Q, type) => ({
      ...Q,
      async [`firestore_getMany_${getName(type)}`]({
        where,
        filters,
      }: {
        where?: QueryWhere[]
        filters?: QueryFilters
      }) {
        const query = makeFirestoreQuery(getName(type), where, filters)(db)
        const snapshot = await query.get()
        const results: any[] = []
        snapshot.forEach((doc) => results.push(doc))
        const documents = await Promise.all(results.map(getDocument))
        console.log(documents)
        return documents
      },
    }),
    {}
  )
  return { queries }
}
