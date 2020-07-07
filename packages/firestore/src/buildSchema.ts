import { Schema } from '@browserql/client'
import baseSchema from './schema'
import buildWhere from './buildWhere'

export default function buildSchema(schema: Schema): void {
  schema.extend(baseSchema)

  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    schema.addTypeFields(`
    extend type ${ typeName } @firestore {
      id: ID!
    }
    `)
    schema.addInput(`
    input FirestoreDocument_${ typeName } {
      ${
        type.fields?.map(field => `${ Schema.getName(field) }: ${ Schema.printType(field.type) }`)
        .join('\n  ')
    }
    }
    `)
    schema.addQuery(`
    extend type Query {
      firestoreGetDocuments_${ typeName }
      : [${ typeName }]!

      firestoreGetDocument_${ typeName }
      : ${ typeName }
    }
  `)
  schema.addMutation(`
    extend type Mutation {
      firestoreSetDocument_${ typeName } (input: FirestoreDocument_${ typeName }) : ${ typeName }
    }
  `)
  }
}
