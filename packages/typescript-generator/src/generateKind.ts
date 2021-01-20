import { getType, ParsedType } from '@browserql/fpql'
import generatePrimitive from './generatePrimitive'
import type { DocumentNode } from 'graphql'
import { NULL_STRATEGY, TSGeneratorOptions } from './types'

export default function generateKind(
  type: ParsedType,
  schema: DocumentNode,
  options: TSGeneratorOptions
): string {
  const { null: nullStrategy = 'null' } = options
  const acceptsMissing =
    nullStrategy === 'missing' ||
    (Array.isArray(nullStrategy) &&
      nullStrategy.includes(NULL_STRATEGY.missing))
  const acceptsNull =
    nullStrategy === 'null' ||
    (Array.isArray(nullStrategy) && nullStrategy.includes(NULL_STRATEGY.null))
  const accepstUndefined =
    nullStrategy === 'undefined' ||
    (Array.isArray(nullStrategy) &&
      nullStrategy.includes(NULL_STRATEGY.undefined))

  let parsed = generatePrimitive(type.type, options)

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
    if (
      !type.required &&
      acceptsNull &&
      typeof type.defaultValue === 'undefined'
    ) {
      next += ' | null'
    }

    if (
      !type.required &&
      accepstUndefined &&
      typeof type.defaultValue === 'undefined'
    ) {
      next += ' | undefined'
    }
    for (let i = 0; i < type.depth; i++) {
      next = `(${next})[]`
    }
    return next
  }

  if (
    !type.required &&
    acceptsNull &&
    typeof type.defaultValue === 'undefined'
  ) {
    parsed += ' | null'
  }

  if (
    !type.required &&
    accepstUndefined &&
    typeof type.defaultValue === 'undefined'
  ) {
    parsed += ' | undefined'
  }

  return parsed
}
