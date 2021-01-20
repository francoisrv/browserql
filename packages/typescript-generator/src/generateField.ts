import { getKind, getName, parseKind } from '@browserql/fpql'
import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import generateKind from './generateKind'
import { NULL_STRATEGY, TSGeneratorOptions } from './types'

export default function generateField(
  schema: DocumentNode,
  options: TSGeneratorOptions
) {
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

  return (field: FieldDefinitionNode) => {
    const q: string[] = ['  ', getName(field)]
    const { arguments: args = [] } = field
    if (!args.length) {
      q.push('()')
    } else {
      q.push('(\n    variables: {')
      q.push(
        ...args.map((arg) => {
          const argType = parseKind(getKind(arg))
          const kind = generateKind(argType, schema, options)
          let line = `\n      ${getName(arg)}`
          if (
            !argType.required &&
            acceptsMissing &&
            typeof argType.defaultValue === 'undefined'
          ) {
            line += '?'
          }

          line += `: ${kind}`
          return line
        })
      )
      q.push('\n    }\n  )')
    }
    q.push(
      `: Promise<${generateKind(parseKind(getKind(field)), schema, options)}>`
    )
    return q.join('')
  }
}
