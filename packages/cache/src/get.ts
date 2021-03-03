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
    const queries = getExecutableQueries(query)
    try {
      const inCache = cache.readQuery<any>({
        query,
        variables,
      })
      if (inCache === null) {
        throw new Error('Cache is null')
      }
      return inCache
    } catch (error) {
      return queries.reduce((acc, executableQuery) => {
        const queryName = getName(executableQuery)
        const queryDefinition = getQuery(queryName)(schema)
        if (!queryDefinition) {
          throw new Error(`query not found in definitions: ${queryName}`)
        }
        const defaultDirective = getDirective('default')(queryDefinition)
        if (defaultDirective) {
          const defaultValueArgument = getArgument('value')(defaultDirective)
          if (defaultValueArgument) {
            return {
              ...acc,
              [queryName]: getValue(defaultValueArgument),
            }
          }
        }
        const kind = parseKind(getKind(queryDefinition))
        return {
          ...acc,
          [queryName]: kind.required ? undefined : null,
        }
      }, {})
    }
  }
}
