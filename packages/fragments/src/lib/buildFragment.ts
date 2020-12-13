import { getType } from '@browserql/fpql'
import type { DocumentNode } from 'graphql'
import buildFragmentSelection from './buildFragmentSelection'

interface Options {
  select?: string[]
}

export default function buildFragment(
  schema: DocumentNode,
  typeName: string,
  options: Options = {}
) {
  const type = getType(typeName)(schema)
  if (!type) {
    throw new Error('Can not build fragment from unknow type '.concat(typeName))
  }
  return buildFragmentSelection(type, schema, options)
}
