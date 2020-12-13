import {
  getArgument,
  getDirective,
  getName,
  getTypes,
  getValue,
} from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

interface Options {
  namingStrategy?: (name: string) => string
}

export default function showCollections(
  schema: DocumentNode | string,
  options: Options = {}
) {
  const document = typeof schema === 'string' ? gql(schema) : schema
  const types = getTypes(document).filter(getDirective('firestore'))
  const collections: { [name: string]: string } = {}
  types.forEach((type) => {
    const name = getName(type)
    const directive = getDirective('firestore')(type)
    const arg = getArgument('collection')(directive)

    let collectionName = name

    if (arg) {
      collectionName = getValue(arg)
    } else if (options.namingStrategy) {
      collectionName = options.namingStrategy(name)
    }

    collections[name] = collectionName
  })
  return collections
}
