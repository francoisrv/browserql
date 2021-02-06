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
  let Data = typeof data === 'undefined' ? variables : data
  return function (cache, schema) {
    console.log({ Data })
    cache.writeQuery({
      query,
      variables,
      data: Data,
    })
    console.log(123, cache.readQuery({ query, variables }))
  }
}
