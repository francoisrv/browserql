import type { DocumentNode } from 'graphql'
import type { Schemaql, SchemaqlFactory } from '@browserql/types'

import enhanceSchema, { getName, hasDirective } from '@browserql/schema'
import GraphQLJSON from 'graphql-type-json'
import { mergeTypeDefs } from '@graphql-tools/merge'

import { paginate, getOne, getById } from './queries'
import { convertName } from './utils'
import SCHEMA from './schema'
import { Query, QueryFilters } from './types'
import makeContext from './makeContext'

export default function connectFirestore(options: Schemaql = {}): SchemaqlFactory {
  return function (schemaql: Schemaql) {
    const typeDefs: Array<DocumentNode | string> = []
    const nextTypeDefs: Array<DocumentNode | string> = [SCHEMA]
    const context = makeContext()

    if (options.schema) {
      typeDefs.push(options.schema)
      nextTypeDefs.push(options.schema)
    }
    if (schemaql.schema) {
      typeDefs.push(schemaql.schema)
    }

    const schema = enhanceSchema(mergeTypeDefs(typeDefs))

    const targetTypes = schema.getTypes().filter(type => hasDirective(type, 'firestore'))

    const queries: Schemaql['queries'] = {}

    targetTypes.forEach(type => {
      const name = getName(type)
      const collection = convertName(name)
      
      const getOneName = `firestore_getOne_${name}`
      const getManyName = `firestore_getMany_${name}`
      const getByIdName = `firestore_getById_${name}`
      
      queries[getOneName] = async (variables: any) => {
        return await getOne(collection, variables.where)
      }
      queries[getByIdName] = async (variables: any) => {
        return await getById(collection, variables.id)
      }
      queries[getManyName] = async ({ where }: any) => {
        return await paginate(collection, where)
      }

      nextTypeDefs.push(`
        extend type ${name} {
          id: ID!
        }

        extend type Query {
          ${getOneName}(
            where: [FirestoreWhere]
            filters: FirestoreFilters
          ): ${name}
          
          ${getByIdName}(id: ID): ${name}
          
          ${getManyName}(
            where: [FirestoreWhere]
            filters: FirestoreFilters
          ): [${name}]!
        }
      `)
    })

    const scalars = {
      JSON: GraphQLJSON,
    }

    const merged = mergeTypeDefs(nextTypeDefs)

    return {
      schema: merged,
      queries,
      scalars,
      context,
    }
  }
}
