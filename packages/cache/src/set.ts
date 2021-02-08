import type { BrowserqlClient } from '@browserql/types'
import type { DocumentNode } from 'graphql'
import get from './get'

type SetCache = (cache: BrowserqlClient['cache'], schema: DocumentNode) => void

export default function set(query: DocumentNode, data: any): SetCache

export default function set(
  query: DocumentNode,
  variables: any,
  data: any
): SetCache

export default function set(
  query: DocumentNode,
  variables: any,
  data?: any
): SetCache {
  let Data = typeof data === 'undefined' ? variables : data
  return function (cache, schema) {
    let nextData = Data
    if (typeof nextData === 'function') {
      nextData = nextData(get(query, variables)(cache, schema))
    }
    cache.writeQuery({
      query,
      variables,
      data: nextData,
    })
  }
}
