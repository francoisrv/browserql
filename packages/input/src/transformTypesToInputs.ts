import { getTypes, merge } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import transformTypeToInput from './transformTypeToInput'

export default function transformTypesToInputs(schema: DocumentNode) {
  const types = getTypes(schema)
  return merge(...types.map((type) => transformTypeToInput(type, schema)))
}
