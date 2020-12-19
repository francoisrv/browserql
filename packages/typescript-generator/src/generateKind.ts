import { getType, ParsedType } from '@browserql/fpql'
import generatePrimitive from './generatePrimitive'
import type { DocumentNode } from 'graphql'
import { TSGeneratorOptions } from './types'

export default function generateKind(
  type: ParsedType,
  schema: DocumentNode,
  options: TSGeneratorOptions
) {
  let parsed = generatePrimitive(type.type)
  if (!parsed) {
    const t = getType(type.type)(schema)
    if (t) {
      if (options.typeSuffix) {
        parsed = `${type.type}${options.typeSuffix}`
      }
    }
  }
  if (!parsed) {
    parsed = type.type
  }
  if (type.depth) {
    let next = parsed
    for (let i = 0; i < type.depth; i++) {
      next = `(${next})[]`
    }
    return next
  }
  return parsed
}
