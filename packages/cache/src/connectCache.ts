import { getKind, getQuery, ParsedType, parseKind } from '@browserql/fpql'
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
  function get(queryName: string, variables?: any) {
    const query = gql`
    query {
      ${queryName}
    }
    `
    try {
      const data = cache.readQuery({
        query,
        variables,
      })
      // @ts-ignore
      return data[queryName]
    } catch (error) {
      const query = getQuery(queryName)(schema)
      const kind = parseKind(getKind(query as FieldDefinitionNode))
      if (kind.required) {
        return getDefault(kind)
      }
      return null
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

  return (entry: string) => {
    const api = {
      get(variables?: any) {
        return get(entry, variables)
      },
      set(variablesOrData: any, data?: any) {
        if (typeof data === 'undefined') {
          set(entry, {}, variablesOrData)
        } else {
          set(entry, variablesOrData, data)
        }
      },
    }

    return api
  }
}
