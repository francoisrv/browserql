import { getFields, getKind, getName, parseKind } from '@browserql/fpql'
import {
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  InputObjectTypeDefinitionNode,
  InputObjectTypeExtensionNode,
  DocumentNode,
} from 'graphql'
import generateKind from './generateKind'
import generateTSDeclaration from './generateTSDeclaration'
import { NULL_STRATEGY, TSGeneratorOptions } from './types'

export default function generateType(
  type:
    | ObjectTypeDefinitionNode
    | ObjectTypeExtensionNode
    | InputObjectTypeDefinitionNode
    | InputObjectTypeExtensionNode,
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

  const lines: string[] = []
  lines.push(`${generateTSDeclaration(getName(type), 'interface', options)} {`)
  const fields = getFields(type as ObjectTypeDefinitionNode)
  for (const field of fields) {
    const parsedType = parseKind(getKind(field))
    const fieldName = getName(field)
    const kind = generateKind(parsedType, schema, options)

    let line = `  ${fieldName}`

    if (!parsedType.required && acceptsMissing) {
      line += '?'
    }

    line += `: ${kind}`

    lines.push(line)
  }
  lines.push('}')
  return lines.join('\n')
}
