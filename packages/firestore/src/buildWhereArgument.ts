import { Schema } from '@browserql/client'

export function buildWhereArgument(field: any, schema: Schema): string {
  if (field.type.kind === 'NamedType') {
    const Type = Schema.getName(field.type)
    if (Type === 'String') {
      return `${ Schema.getName(field) }: FirestoreInputWhereString`
    }
    if (Type === 'ID') {
      return `${ Schema.getName(field) }: FirestoreInputWhereID`
    }
    if (Type === 'Int') {
      return `${ Schema.getName(field) }: FirestoreInputWhereInt`
    }
    if (Type === 'Float') {
      return `${ Schema.getName(field) }: FirestoreInputWhereFloat`
    }
    if (Type === 'Boolean') {
      return `${ Schema.getName(field) }: FirestoreInputWhereBoolean`
    }
    const type = schema.getType(Type)
    if (type) {
      const input = schema.getType(`${ Type }Input`)
      if (!input) {
        schema.extend(`
        input ${ Type }Input {
          ${
            // @ts-ignore
            type.fields.map((field: any) => `${ Schema.getName(field) }: ${ Schema.printType(field.type) }`).join('\n')
          }
        }
        input FirestoreInputWhere${ Type } {
          equals: ${ Type }Input
          equalsNot: ${ Type }Input
        }
        `)
      }
      return `${ Schema.getName(field) }: FirestoreInputWhere${ Type }`
    }
    const enumeration = schema.getEnumeration(Type)
    if (enumeration) {
      return `${ Schema.getName(field) }: FirestoreInputWhereEnum`
    }
  } else if (field.type.kind === 'NonNullType') {
    return buildWhereArgument({
      ...field,
      type: field.type.type
    }, schema)
  } else if (field.type.kind === 'ListType') {
    const type = Schema.printEndType(field.type)
    return `${ Schema.getName(field) }: FirestoreInputWhereArray${ type }`
  }
  return ''
}