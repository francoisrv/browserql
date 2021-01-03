import { parse, parseType, TypeNode } from 'graphql'
import getName from './getName'
import printValue from './printValue'

interface LoopResult {
  type: string
  levels: number
  nests: boolean[]
}

function loop(type: TypeNode, levels = 0, nests: boolean[] = []): LoopResult {
  if (type.kind === 'NamedType') {
    return { type: getName(type), levels, nests }
  }
  if (type.kind === 'ListType') {
    return loop(type.type, levels + 1, [
      ...nests,
      type.type.kind === 'NonNullType',
    ])
  }
  if (type.kind === 'NonNullType') {
    return loop(type.type, levels, nests)
  }
  return { type: '', levels, nests }
}

export interface ParsedType {
  type: string
  depth: number
  required: boolean
  nestedRequired: boolean[]
  defaultValue?: any
}

export default function parseKind(kind: string): ParsedType {
  let kindString = ''
  let defaultValue = undefined
  if (/=/.test(kind)) {
    const [kindStr, defaultValueString] = kind.split(/=/)
    try {
      defaultValue = JSON.parse(defaultValueString.trim())
    } catch (error) {
      defaultValue = defaultValueString.trim()
    }
    kindString = kindStr
  } else {
    kindString = kind
  }
  const p = parseType(kindString)
  const { type, levels, nests } = loop(p)
  return {
    type,
    depth: levels,
    required: p.kind === 'NonNullType',
    nestedRequired: nests,
    defaultValue,
  }
}
