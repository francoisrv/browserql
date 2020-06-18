import { TypeDefinitionNode } from 'graphql'
import { Schema } from '@browserql/client'

export default function getCollectionName(type: TypeDefinitionNode) {
  const typeName = Schema.getName(type)
  const args = Schema.getDirectiveParams(type, 'collection')
  if (args.collection) {
    return args.collection
  }
  let collectionName = typeName?.toLowerCase()
  if (/y$/.test(typeName)) {
    collectionName = collectionName?.replace(/y$/, 'ies')
  } else {
    collectionName += 's'
  }
  return collectionName
}
