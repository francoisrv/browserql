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
      return cache.read({
        query,
        variables,
      })
    } catch (error) {
      const query = getQuery(queryName)
      const kind = parseKind(getKind(query))
      if (kind.required) {
        return getDefault(kind)
      }
      return null
    }
  }

  function set(queryName: string): void
  function set(queryName: string, variables: any): void
  function set(queryName: string): void

  return {
    get,
  }
}
