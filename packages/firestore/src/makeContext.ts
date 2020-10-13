import { getById, getOne, paginate } from "./queries"
import { Query, QueryFilters } from "./types"
import { convertName } from "./utils"

export default function makeContext() {
  return {
    firestore: {
      exec: {
        async paginate(
          collection: string,
          where?: Query | Query[],
          filters?: QueryFilters
        ) {
          const collectionName = convertName(collection)
          return await paginate(collectionName, where, filters)
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
