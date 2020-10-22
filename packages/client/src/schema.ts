import type { DocumentNode } from 'graphql';
import type { Schemaql } from '@browserql/types';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { print } from 'graphql';

export default function makeSchema(typeDefs: Array<string|DocumentNode>, directives: Schemaql['directives']) {
  try {
    return makeExecutableSchema({
      typeDefs,
      schemaDirectives: directives,
    })
  } catch (error) {
    console.log(error)
    console.log({
      directives,
      typeDefs: typeDefs.map(t => {
        if (typeof t === 'string') {
          return t
        }
        return print(t)
      })
    })
    throw new Error('Browserql/Client::Error Could not make executable schema. This probably means you have a invalid GraphQL document')
  }
}
