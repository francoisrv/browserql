import type { DocumentNode } from 'graphql'
import type { Schemaql } from '@browserql/types'

import { makeExecutableSchema } from '@graphql-tools/schema'

export default function makeSchema(
  typeDefs: Array<string | DocumentNode>,
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
