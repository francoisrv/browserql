import { getName } from '@browserql/fpql'
import type { EnumTypeDefinitionNode, EnumTypeExtensionNode } from 'graphql'
import generateTSDeclaration from './generateTSDeclaration'
import { TSGeneratorOptions } from './types'

export default function generateEnumeration(
  enumeration: EnumTypeDefinitionNode | EnumTypeExtensionNode,
  options: TSGeneratorOptions
) {
  const { values = [] } = enumeration
  return generateTSDeclaration(getName(enumeration), 'enum', options)
    .concat(' {\n  ')
    .concat(
      values
        .map(
          (value) => `${getName(value as never)} = '${getName(value as never)}'`
        )
        .join(',\n  ')
    )
    .concat('\n}')
}
