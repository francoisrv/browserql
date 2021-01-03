import { getKind, getType, parseKind } from '@browserql/fpql'
import { buildFragment } from '@browserql/fragments'
import { DocumentNode, FieldDefinitionNode } from 'graphql'

/**
 *
 * @param field
 * @param schema
 */
export default function printSelections(
  field: FieldDefinitionNode,
  schema: DocumentNode
): string {
  const parsedType = parseKind(getKind(field))
  const isType = getType(parsedType.type)(schema)

  if (isType) {
    const fragment = buildFragment(schema, parsedType.type).trim()
    return fragment
      .replace(/^fragment .+ \{/, '{')
      .split('\n')
      .map((line) => `      ${line}`)
      .join('\n')
      .trim()
  }

  return ''
}
