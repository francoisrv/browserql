import { DocumentNode } from 'graphql'
import getTypes from './getTypes'

export default function group(schema: DocumentNode) {
  const types = getTypes(schema)
  const nextTypes: any[] = []
  types.forEach((type) => {
    if (type.kind === 'ObjectTypeExtension') {
    } else {
      nextTypes.push()
    }
  })
  return schema
}
