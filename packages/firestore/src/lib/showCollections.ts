import { getArgument, getDirective, getName, getTypes } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export default function showCollections(schema: DocumentNode | string) {
  const document = typeof schema === 'string' ? gql(schema) : schema
  const types = getTypes(document).filter(getDirective('firestore'))
  const collections: { [name: string]: string } = {}
  types.forEach((type) => {
    const name = getName(type)
    const directive = getDirective('firestore')(type)
    const arg = getArgument('collection')(directive)
    let collectionName = name
    collections[name] = collectionName
  })
  return collections
}
