import type { ObjectTypeExtensionNode, FieldDefinitionNode, DocumentNode } from 'graphql'
import { getFields, getKind, getName, parseKind } from '@browserql/fpql'
import gql from 'graphql-tag'

function parseField(field: FieldDefinitionNode) {
  const { type } = parseKind(getKind(field))
  const exists = 
}

export default function transformTypeToInput(type: ObjectTypeExtensionNode) {
  const fields = getFields(type)
  return `
    input ${getName(type)}Input {
      ${fields.map((field) => `${getName(field)}: ID`).join('\n')}
    }
  `
}
