import type { DocumentNode } from 'graphql';
import type { Schemaql } from '@browserql/types';

import { makeExecutableSchema } from '@graphql-tools/schema';

export default function makeSchema(typeDefs: Array<string|DocumentNode>, directives: Schemaql['directives']) {
  return makeExecutableSchema({
    typeDefs,
    schemaDirectives: directives,
  })
}
