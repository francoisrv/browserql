import { DocumentNode } from 'graphql';
import enhanceSchema from '@browserql/schemax';

export default function makeContracts(document: string | DocumentNode) {
  const schema = enhanceSchema(document);
  const queries = schema.getQueries();
}
