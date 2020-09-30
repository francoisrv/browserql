import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import enhanceSchema from '@browserql/schemax';

export default function buildFragments(document: string | DocumentNode) {
  const schema = enhanceSchema(document);
  const queries = schema.getQueries();
}
