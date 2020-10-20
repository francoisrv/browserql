import type { DirectiveNode, ObjectTypeDefinitionNode, StringValueNode } from 'graphql'
import type { Schemaql, BrowserqlContext } from '@browserql/types'

import { getName } from '@browserql/schema'

import { makeNames } from './makeName'
import { getById, getOne, paginate } from './queries'
import { convertName } from './utils'

export default function makeResolvers(type: ObjectTypeDefinitionNode) {
  const name = getName(type)
  const { directives = [] } = type
  const directive = directives.find(directive => getName(directive) === 'firestore') as DirectiveNode
  const { arguments: args = [] } = directive
  const collectionArg = args.find(arg => getName(arg) === 'collection')
  const collection = collectionArg ? (collectionArg.value as StringValueNode).value : convertName(name)
  console.log({collection})

  const names = makeNames(name)

  const queries: Schemaql['queries'] = {}

  Object.keys(names).map(queryName => {
    const fullName = names[queryName as keyof typeof names]
    queries[fullName] = async (variables: any, ctx: BrowserqlContext) => {
      switch (queryName) {
        case 'paginate': return await paginate({
          collection,
          type: name,
          where: variables.where,
          filters: variables.filters,
        }, ctx.browserqlClient)

        case 'getOne': return await getOne(
          collection,
          variables.where,
          variables.filters,
        )

        case 'getById': return await getById(
          collection,
          variables.id,
        )
      }
    }
  })

  return queries
}
