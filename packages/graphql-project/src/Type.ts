import { getField, getFields, getName, getType } from '@browserql/fpql'
import { parseType } from 'graphql'
import { FieldDefinitionNode } from 'graphql'
import { ObjectTypeDefinitionNode } from 'graphql'
import { DocumentNode, parse } from 'graphql'

export function removeTypeFromSchema(
  schema: DocumentNode,
  typeName: string
): DocumentNode {
  return {
    ...schema,
    definitions: schema.definitions.filter((def) => getName(def) !== typeName),
  }
}

export function addTypeToSchema(
  schema: DocumentNode,
  typeName: string
): DocumentNode {
  const extension = parse(`type ${typeName}`)
  return {
    ...schema,
    definitions: [...schema.definitions, extension.definitions[0]],
  }
}

export function addFieldToSchema(
  schema: DocumentNode,
  typeName: string,
  fieldName: string,
  kind = 'ID'
): DocumentNode {
  const extension = parse(`type ${typeName} { ${fieldName}: ${kind} }`)
  const type = extension.definitions.find(
    (def) => getName(def) === typeName
  ) as ObjectTypeDefinitionNode
  const field = getField(fieldName)(type)
  return {
    ...schema,
    definitions: schema.definitions.map((def) => {
      if (getName(def) === typeName && def.kind === 'ObjectTypeDefinition') {
        return {
          ...def,
          fields: [...getFields(def), field],
        }
      }
      return def
    }),
  }
}

export function updateSchemaField(
  schema: DocumentNode,
  typeName: string,
  fieldName: string,
  field: FieldDefinitionNode
) {
  return {
    ...schema,
    definitions: schema.definitions.map((def) => {
      if (getName(def) === typeName && def.kind === 'ObjectTypeDefinition') {
        return {
          ...def,
          fields: getFields(def).map((f) => {
            if (getName(f) === fieldName) {
              return field
            }
            return f
          }),
        }
      }
      return def
    }),
  }
}

export function updateFieldKind(field: FieldDefinitionNode, kind: string) {
  return {
    ...field,
    type: parseType(kind),
  }
}

export function removeSchemaField(
  schema: DocumentNode,
  typeName: string,
  fieldName: string
) {
  return {
    ...schema,
    definitions: schema.definitions.map((def) => {
      if (getName(def) === typeName && def.kind === 'ObjectTypeDefinition') {
        return {
          ...def,
          fields: getFields(def).filter((f) => getName(f) !== fieldName),
        }
      }
      return def
    }),
  }
}
