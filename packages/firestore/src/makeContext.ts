import { getType } from '@browserql/fpql'
import { firestore } from 'firebase'
import type { DocumentNode } from 'graphql'
import { getById, getOne, paginate } from './queries'
import { Query, QueryFilters } from './types'
import { convertName, getCollectionName } from './utils'

export default function makeContext(
  schema: DocumentNode,
  db: firestore.Firestore
) {
  return {
    firestore: {
      exec: {
        async paginate(
          typeName: string,
          where?: Query | Query[],
          filters?: QueryFilters
        ) {
          const type = getType(typeName)(schema)
          if (!type) {
            throw new Error(`firestoreql.exec: Type not in schema: ${typeName}`)
          }
          const collectionName = getCollectionName(type)
          return await paginate(db, {
            collection: collectionName,
            where,
            filters,
          })
        },

        async getOne(
          collection: string,
          where?: Query | Query[],
          filters?: QueryFilters
        ) {
          const collectionName = convertName(collection)
          return await getOne(db, collectionName, where, filters)
        },

        async getById(collection: string, id: string) {
          const collectionName = convertName(collection)
          return await getById(db, collectionName, id)
        },
      },
      model(collection: string) {},
    },
  }
}
