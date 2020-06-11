import { Schema } from '@browserql/client'
import gql from 'graphql-tag'

function buildWhereArg(field: any, schema: Schema): string {
  if (field.type.kind === 'NamedType') {
    if (field.type.name.value === 'String') {
      return `${ Schema.getName(field) }: FirestoreInputWhereString`
    }
    if (field.type.name.value === 'ID') {
      return `${ Schema.getName(field) }: FirestoreInputWhereID`
    }
    if (field.type.name.value === 'Int') {
      return `${ Schema.getName(field) }: FirestoreInputWhereInt`
    }
    if (field.type.name.value === 'Float') {
      return `${ Schema.getName(field) }: FirestoreInputWhereFloat`
    }
    if (field.type.name.value === 'Boolean') {
      return `${ Schema.getName(field) }: FirestoreInputWhereBoolean`
    }
    const type = schema.getType(field.type.name.value)
    if (!type) {
      throw new Error(`No such type: ${ field.type.name.value }`)
    }
    const input = schema.getType(`${ field.type.name.value }Input`)
    if (!input) {
      schema.extend(`
      input ${ field.type.name.value }Input {
        ${
          type.fields.map((field: any) => `${ Schema.getName(field) }: ${ Schema.printType(field.type) }`).join('\n')
        }
      }
      input FirestoreInputWhere${ field.type.name.value } {
        equals: ${ field.type.name.value }Input
        equalsNot: ${ field.type.name.value }Input
      }
      `)
    }
    return `${ Schema.getName(field) }: FirestoreInputWhere${ field.type.name.value }`
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
    const findName = `firestoreFind${ typeName }`
    const findOneName = `firestoreFindOne${ typeName }`
    schema.extend(`
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
      ${ findName }(
        paging: FirestorePaging
        where: FirestoreWhere${ typeName }
      ): [${ typeName }!]!

      ${ findOneName }(
        where: FirestoreWhere${ typeName }
      ): ${ typeName }
    }
    `)
  }
}