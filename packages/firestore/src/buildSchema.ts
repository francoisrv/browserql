import { GraphQLSchema, DocumentNode } from 'graphql'
import { getTypesWithDirective, getName } from '@browserql/utils'
import gql from 'graphql-tag'

export default function buildSchema(schema: GraphQLSchema): DocumentNode {
  const source: string[] = [
    '"""',
    'firestore directive',
    '"""',
    'directive @firestore(',
    '  """',
    '  (Optional) The name of the collection. If not specified, it is the plural of the typename in lower case',
    '  """',
    '  collection: String',
    ') on OBJECT'
  ]

  const types = getTypesWithDirective(schema, 'firestore')

  for (const type of types) {
    const typeName = getName(type)
    const findName = `firestoreFind${ typeName }`
    source.push(`
    extend type Query {
      ${ findName }: [ ${ typeName } ]
    }
    `)
  }

  return gql(source.join('\n'))
}