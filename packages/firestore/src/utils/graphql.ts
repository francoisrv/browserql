import { getDirective, getName, getTypes } from '@browserql/fpql'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export function makeSchema(schema: DocumentNode) {
  const types = getTypes(schema)
  const collections = types.filter(getDirective('firestore'))
  const schemas: DocumentNode[] = []
  collections.forEach((collection) => {
    const name = getName(collection)
    schemas.push(gql`
    extend type ${name} {
      id: ID!
    }
    `)
    schemas.push(gql`
      extend type Query {
       firestore_getMany_${name}(
         where: [ FirestoreWhere ]
         filters: FirestoreFilters
       ): [${name}!]!

       firestore_getOne_${name}(
         where: [ FirestoreWhere ]
         filters: FirestoreFilters
       ): ${name}!

       firestore_count_${name}(
         where: [ FirestoreWhere ]
         filters: FirestoreFilters
       ): Int!
      }
    `)
  })
  return schemas
}
