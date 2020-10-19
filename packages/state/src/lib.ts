import resolve from '@browserql/resolved'
import { ParsedType } from '@browserql/schema'
import { BrowserqlClient } from '@browserql/types'

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
    case 'Int': return encapsulate(kind, 0)
  }
}

export function get(type: string, field: string, kind: ParsedType) {
  return (client: BrowserqlClient) => () => {
    try {
      const resolved = resolve(client.schema)
      const name = `state_${type}_${field}_get`
      return client.cache.read(resolved.Query[name])
    } catch (error) {
      if (kind.required) {
        return getDefault(kind)
      }
      return null
    }
  }
}

export function set(type: string, field: string, data: any) {
  return (client: BrowserqlClient) => () => {
    const resolved = resolve(client.schema)
    const name = `state_${type}_${field}_set`
    client.cache.write({
      ...resolved.Mutation[name],
      data,
    })
  }
}