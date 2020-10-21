import enhanceSchema from '@browserql/schema'
import type { DocumentNode } from 'graphql'
import { getById, getOne, paginate } from "./queries"
import { Query, QueryFilters } from "./types"
import { convertName, getCollectionName } from "./utils"

export default function makeContext(schema: DocumentNode) {
  const enhanced = enhanceSchema(schema)

  return {
    firestore: {
      exec: {
        async paginate(
          typeName: string,
          where?: Query | Query[],
          filters?: QueryFilters
        ) {
          const type = enhanced.getType(typeName)
          if (!type) {
            throw new Error(`firestoreql.exec: Type not in schema: ${typeName}`)
          }
          const collectionName = getCollectionName(type)
          return await paginate({
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
          return await getOne(collectionName, where, filters)
        },

        async getById(
          collection: string,
          id: string
        ) {
          const collectionName = convertName(collection)
          return await getById(collectionName, id)
        }
      },
      model(collection: string) {
        
      }
    }
  }
}
