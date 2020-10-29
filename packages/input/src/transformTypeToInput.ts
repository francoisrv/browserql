import type {
  ObjectTypeExtensionNode,
  FieldDefinitionNode,
  DocumentNode,
  ObjectTypeDefinitionNode,
} from 'graphql'
import {
  getFields,
  getKind,
  getName,
  getType,
  parseKind,
  printParsedKind,
} from '@browserql/fpql'
import gql from 'graphql-tag'

function parseField(field: FieldDefinitionNode, schema: DocumentNode) {
  const kind = getKind(field)
  const parsed = parseKind(kind)
  const exists = getType(parsed.type)(schema)
  if (exists) {
    return printParsedKind({ ...parsed, type: parsed.type.concat('Input') })
  }
  return kind
}

export default function transformTypeToInput(
  type: ObjectTypeExtensionNode | ObjectTypeDefinitionNode,
  schema: DocumentNode
) {
  const fields = getFields(type)
  return gql`
input ${getName(type)}Input {
  ${fields
    .map(
      (field) =>
        `${getName(field)}: ${parseField(field as FieldDefinitionNode, schema)}`
    )
    .join('\n  ')}
}
`
}
