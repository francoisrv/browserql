import { Schema } from '@browserql/client'
import gql from 'graphql-tag'
import { FIND_QUERY, FIND_ONE_QUERY, FIND_BY_ID_QUERY } from './utils'

export function buildWhereArg(field: any, schema: Schema): string {
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
    return buildWhereArg({
      ...field,
      type: field.type.type
    }, schema)
  } else if (field.type.kind === 'ListType') {
    const type = Schema.printEndType(field.type)
    return `${ Schema.getName(field) }: FirestoreInputWhereArray${ type }`
  }
  return ''
}

function buildWhere(type: any, schema: Schema): string[] {
  const lines: string[] = []
  for (const field of type.fields) {
    lines.push(buildWhereArg(field, schema))
  }
  return lines
}

export default function buildSchema(schema: Schema): void {
  schema.extend(gql`
  directive @firestore(collection: String) on OBJECT
  
  directive @rel(type: String!) on FIELD_DEFINITION

  input FirestorePaging {
    page: Int
    rowsPerPage: Int
  }

  input FirestoreInputWhereID {
    equals: String
    equalsNot: String
  }

  input FirestoreInputWhereString {
    equals: String
    equalsNot: String
    matches: String
  }

  input FirestoreInputWhereInt {
    equals: Int
    equalsNot: Int
    below: Int
    above: Int
    belowOrEqual: Int
    aboveOrEqual: Int
  }

  input FirestoreInputWhereFloat {
    equals: Int
    equalsNot: Int
    below: Int
    above: Int
    belowOrEqual: Int
    aboveOrEqual: Int
  }

  input FirestoreInputWhereBoolean {
    equals: Boolean
    equalsNot: Boolean
  }

  input FirestoreInputWhereGeo {
    latitudeEquals: Float
    latitudeEqualsNot: Float
    longitudeEquals: Float
    longitudeEqualsNot: Float
    shapeEquals: [Float]
    shapeEqualsNot: [Float]
  }

  input FirestoreInputWhereEnum {
    equals: String
    equalsNot: String
  }

  input FirestoreInputWhereArrayString {
    equals: [String]
    equalsNot: [String]
    includes: String
    includesNot: String
    size: Int
    sizeNot: Int
    includeMatch: String
    includeMatchNot: String
  }

  input FirestoreInputWhereArrayID {
    equals: [String]
    equalsNot: [String]
    includes: String
    includesNot: String
    size: Int
    sizeNot: Int
  }

  input FirestoreInputWhereArrayInt {
    equals: [Int]
    equalsNot: [Int]
    includes: Int
    includesNot: Int
    size: Int
    sizeNot: Int
  }

  input FirestoreInputWhereArrayFloat {
    equals: [Int]
    equalsNot: [Int]
    includes: Int
    includesNot: Int
    size: Int
    sizeNot: Int
  }

  input FirestoreInputWhereArrayBoolean {
    equals: [Boolean]
    equalsNot: [Boolean]
    includes: Boolean
    includesNot: Boolean
    size: Int
    sizeNot: Int
  }
  `)

  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    schema.addTypeFields(`
    extend type ${ typeName } @firestore {
      id: ID!
    }
    `)
    schema.addInput(`
    input FirestoreWhere${ typeName } {
      ${ buildWhere(type, schema).join('\n  ') }
    }
    `)
    schema.addQuery(`
    extend type Query {
      ${ FIND_QUERY(typeName) }(
        paging: FirestorePaging
        where: FirestoreWhere${ typeName }
      ): [${ typeName }!]!

      ${ FIND_ONE_QUERY(typeName) }(
        where: FirestoreWhere${ typeName }
      ): ${ typeName }

      ${ FIND_BY_ID_QUERY(typeName) }(
        id: ID!
      ): ${ typeName }
    
    }
    `)
  }
}
