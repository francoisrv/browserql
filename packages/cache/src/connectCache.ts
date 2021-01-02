import { BrowserqlClient } from '@browserql/types'
import type { DocumentNode } from 'graphql'
import get from './get'
import set from './set'

export default function connectCache(
  cache: BrowserqlClient['cache'],
  schema: DocumentNode
) {
  return {
    get(query: DocumentNode, variables?: any) {
      return get(query, variables)(cache, schema)
    },
    set(query: DocumentNode, variables: any, data?: any) {
      return set(query, variables, data)(cache, schema)
    },
  }
}
