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
import { TSGeneratorOptions } from './types'

export default function generateType(
  type:
    | ObjectTypeDefinitionNode
    | ObjectTypeExtensionNode
    | InputObjectTypeDefinitionNode
    | InputObjectTypeExtensionNode,
  schema: DocumentNode,
  options: TSGeneratorOptions
) {
  const lines: string[] = []
  lines.push(`${generateTSDeclaration(getName(type), 'interface', options)} {`)
  const fields = getFields(type as ObjectTypeDefinitionNode)
  for (const field of fields) {
    const parsedType = parseKind(getKind(field))
    lines.push(
      `  ${getName(field)}${parsedType.required ? '' : '?'}: ${generateKind(
        parsedType,
        schema,
        options
      )}`
    )
  }
  lines.push('}')
  return lines.join('\n')
}
