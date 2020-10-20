import resolve from '@browserql/resolved'
import { getKind, getName, ParsedType, parseKind } from '@browserql/schema'
import { BrowserqlClient } from '@browserql/types'
import type { FieldDefinitionNode } from 'graphql' 

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
    case 'Float': return encapsulate(kind, 0)
    case 'String': return encapsulate(kind, '')
    case 'Boolean': return encapsulate(kind, false)
  }
}

export function get(
  client: BrowserqlClient,
  type: string,
  field: FieldDefinitionNode
) {
  try {
    const resolved = resolve(client.schema)
    const name = `state_${type}_${getName(field)}_get`
    return client.cache.read(resolved.Query[name])
  } catch (error) {
    const kind = parseKind(getKind(field))
    if (kind.required) {
      return getDefault(kind)
    }
    return null
  }
}

export function set(client: BrowserqlClient, type: string, field: string, data: any) {
  const resolved = resolve(client.schema)
  const name = `state_${type}_${field}_set`
  client.cache.write({
    ...resolved.Mutation[name],
    data,
  })
  return true
}

export function increment(
  client: BrowserqlClient,
  type: string,
  field: FieldDefinitionNode,
  step = 1
) {
  const value = get(client, type, field)
  const nextValue = value + step
  set(client, type, getName(field), nextValue)
  return true
}

export function decrement(
  client: BrowserqlClient,
  type: string,
  field: FieldDefinitionNode,
  step = 1
) {
  const value = get(client, type, field)
  const nextValue = value - step
  set(client, type, getName(field), nextValue)
  return true
}

export function toggle(
  client: BrowserqlClient,
  type: string,
  field: FieldDefinitionNode,
) {
  const value = get(client, type, field)
  const nextValue = !value
  set(client, type, getName(field), nextValue)
  return true
}
