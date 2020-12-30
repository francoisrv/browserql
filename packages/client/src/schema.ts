import type { DocumentNode } from 'graphql'
import type { Schemaql } from '@browserql/types'

import { makeExecutableSchema } from '@graphql-tools/schema'

/**
 * Build an executable GraphQL schema
 * @param {DocumentNode[]} typeDefs An array of definitions
 * @param {*} directives An object of directives
 */
export default function makeSchema(
  typeDefs: DocumentNode[],
  directives: Schemaql['directives']
) {
  try {
    return makeExecutableSchema({
      typeDefs,
      // @ts-ignore
      schemaDirectives: directives,
    })
  } catch (error) {
    console.log(error)
    throw new Error(`Browserql/Client::Could not make schema::${error.message}`)
  }
}
