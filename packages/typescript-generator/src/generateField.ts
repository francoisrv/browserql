import { getKind, getName, parseKind } from '@browserql/fpql'
import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import generateKind from './generateKind'
import { TSGeneratorOptions } from './types'

export default function generateField(
  schema: DocumentNode,
  options: TSGeneratorOptions
) {
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
          return `\n      ${getName(arg)}${
            argType.required ? '' : '?'
          }: ${generateKind(argType, schema, options)},`
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
