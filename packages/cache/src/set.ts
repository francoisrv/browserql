import { getExecutableQueries, getName, getQuery } from '@browserql/fpql'
import type { BrowserqlClient } from '@browserql/types'
import type { DocumentNode } from 'graphql'

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
  let Variables = typeof data === 'undefined' ? variables : {}
  let Data = typeof data === 'undefined' ? variables : data
  const queryName = getName(query.definitions[0])
  const queries = getExecutableQueries(query)
  if (queries.length > 1) {
  }
  return function (cache, schema) {
    cache.writeQuery({
      query,
      variables: Variables,
      data: {
        [queryName]: Data,
      },
    })
  }
}
