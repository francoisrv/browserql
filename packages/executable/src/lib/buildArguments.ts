import {
  getArguments,
  getDefaultValue,
  getField,
  getKind,
  getMutation,
  getName,
  getQuery,
  getType,
} from '@browserql/fpql'
import {
  DocumentNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql'

/**
 * Return an object representing a field's arguments
 * @param {DocumentNode} schema The GraphQL definitions
 * @param {string} path The path to the field, using dot notation, ie `Type.field`
 * @example buildArguments(schema, 'Query.getUserById') // { id: 'ID!' }
 */
export default function buildArguments(
  schema: DocumentNode,
  path: string
): Record<string, string> {
  const object: Record<string, string> = {}

  const [typeName, fieldName] = path.split(/\./)
  let field: FieldDefinitionNode

  if (typeName === 'Query') {
    field = getQuery(fieldName)(schema) as FieldDefinitionNode
  } else if (typeName === 'Mutation') {
    field = getMutation(fieldName)(schema) as FieldDefinitionNode
  } else {
    const type = getType(typeName)(schema)
    if (!type) {
      console.warn(`Type not found in schema: ${typeName}`)
      return object
    }
    field = getField(fieldName)(type) as FieldDefinitionNode
  }

  if (!field) {
    console.warn(`Field not found in schema: ${path}`)
    return object
  }

  const args = getArguments(field) as InputValueDefinitionNode[]

  args.forEach((arg) => {
    let kind = getKind(arg)
    const val = getDefaultValue(arg)
    if (typeof val !== 'undefined') {
      kind += ` = ${JSON.stringify(val, null, 2)}`
    }
    object[getName(arg)] = kind
  })

  return object
}
