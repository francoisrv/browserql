import {
  getArgument,
  getDirective,
  getExecutableQueries,
  getKind,
  getName,
  getQueries,
  getQuery,
  getValue,
  ParsedType,
  parseKind,
} from '@browserql/fpql'
import { BrowserqlClient } from '@browserql/types'
import gql from 'graphql-tag'
import type { DocumentNode, FieldDefinitionNode } from 'graphql'

export function encapsulate(kind: ParsedType, value: any) {
  if (kind.depth) {
    let next: any = value
    for (let i = 0; i < kind.depth; i++) {
      next = [next]
    }
    return next
  }
  return value
}

export function getDefault(kind: ParsedType) {
  switch (kind.type) {
    case 'Int':
      return encapsulate(kind, 0)
    case 'Float':
      return encapsulate(kind, 0)
    case 'String':
      return encapsulate(kind, '')
    case 'Boolean':
      return encapsulate(kind, false)
  }
}

export default function connectCache(
  cache: BrowserqlClient['cache'],
  schema: DocumentNode
) {
  function get(query: DocumentNode, variables?: any) {
    const [queryOperation] = getExecutableQueries(query)
    const queryName = getName(queryOperation)
    try {
      const data = cache.readQuery({
        query,
        variables,
      })
      // @ts-ignore
      return data[queryName]
    } catch (error) {
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

  function set(queryName: string, variables: any, data: any) {
    const source = `
      query {
        ${queryName}
      }
    `
    const query = gql(source)
    cache.writeQuery({
      query,
      variables,
      data: {
        [queryName]: data,
      },
    })
  }

  return {
    get,
    set,
  }
}
