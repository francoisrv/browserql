import { getExecutableQueries, getName, getQuery } from '@browserql/fpql'
import type { BrowserqlClient } from '@browserql/types'
import type { DocumentNode } from 'graphql'
import { print } from 'graphql'

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
  const [doc] = getExecutableQueries(query)
  const queryName = getName(doc)
  return function (cache, schema) {
    console.log({
      query: print(query),
      variables,
      data: {
        [queryName]: Data,
      },
    })
    cache.writeQuery({
      query,
      variables,
      data: {
        [queryName]: Data,
      },
    })
    console.log(123, cache.readQuery({ query, variables }))
  }
}
