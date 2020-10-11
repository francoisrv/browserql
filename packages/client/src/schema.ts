import { makeExecutableSchema } from '@graphql-tools/schema';
import { DocumentNode } from 'graphql';
import { Schemaql } from './types';

export default function makeSchema(typeDefs: Array<string|DocumentNode>, directives: Schemaql['directives']) {
  console.log(0)
  return makeExecutableSchema({
    typeDefs,
    schemaDirectives: directives,
  })
}
