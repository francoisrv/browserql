import type { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from 'graphql'
import type { Schemaql, BrowserqlContext } from '@browserql/types'
import buildFragments from '@browserql/fragments'
import gql from 'graphql-tag'
import { getName } from '@browserql/fpql'
import resolve from '@browserql/resolved'

import { makeNames } from './makeName'
import { addOne, getById, getOne, paginate, updateById } from './queries'
import { getCollectionName } from './utils'
import { firestore } from 'firebase'

/**
 *
 * @param type {ObjectTypeDefinitionNode} A GraphQL type with a firestore directive
 * @example makeResolvers(gql`type Foo @firestore`)
 * @description Provided a type tagged as a firestore collection, this will create all the
 * queries and mutations for that type
 */
export default function makeResolvers(
  type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
  db: firestore.Firestore
) {
  const name = getName(type)
  const collection = getCollectionName(type)
  const names = makeNames(name)
  const queries: Schemaql['queries'] = {}
  Object.keys(names).map((queryName) => {
    const fullName = names[queryName as keyof typeof names]
    queries[fullName] = async (variables: any, ctx: BrowserqlContext) => {
      const { apollo, schema } = ctx.browserqlClient
      const fragments = buildFragments(schema)
      const resolved = resolve(schema)
      switch (queryName) {
        case 'paginate':
          return await paginate(
            db,
            {
              collection,
              where: variables.where,
              filters: variables.filters,
            },
            (documents: { id: string }[]) => {
              apollo.cache.writeQuery({
                ...resolved.Query[fullName](variables),
                data: {
                  [fullName]: documents.map((doc) => ({
                    ...doc,
                    __typename: name,
                  })),
                },
              })
              apollo.query(resolved.Query[fullName](variables))
            }
          )
        case 'getOne':
          return await getOne(
            db,
            collection,
            variables.where,
            variables.filters
          )

        case 'getById':
          return await getById(db, collection, variables.id)

        case 'addOne':
          return await addOne(db, collection, variables.input)

        case 'updateById':
          return await updateById(
            db,
            collection,
            variables.id,
            variables.transformers
          )
      }
    }
  })
  return queries
}
