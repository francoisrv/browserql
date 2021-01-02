import type { DocumentNode } from 'graphql'
import type { BrowserqlClient } from '@browserql/types'
import {
  getArgument,
  getDirective,
  getExecutableQueries,
  getKind,
  getName,
  getQuery,
  getValue,
  parseKind,
} from '@browserql/fpql'

export default function get(query: DocumentNode, variables?: any) {
  return function (cache: BrowserqlClient['cache'], schema: DocumentNode) {
    const [queryOperation] = getExecutableQueries(query)
    const queryName = getName(queryOperation)

    // First, we'll try to get the value directly from the cache
    try {
      const data = cache.readQuery<any>({
        query,
        variables,
      })
      return data[queryName]
    } catch (error) {
      // If apollo cache found no matching entries, it will throw
      // We catch that error and proceed in our search of a value to return

      const queryDefinition = getQuery(queryName)(schema)
      if (!queryDefinition) {
        throw new Error(`query not found in definitions: ${queryName}`)
      }
      const defaultDirective = getDirective('default')(queryDefinition)
      if (defaultDirective) {
        const defaultValueArgument = getArgument('value')(defaultDirective)
        if (defaultValueArgument) {
          return getValue(defaultValueArgument)
        }
      }
      const kind = parseKind(getKind(queryDefinition))
      return kind.required ? undefined : null
    }
  }
}
