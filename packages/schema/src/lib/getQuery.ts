import { DocumentNode } from 'graphql';
import getName from './getName';
import getQueries from './getQueries';
import toDocument from './toDocument';

export default function getQueryByName(doc: DocumentNode | string, name: string) {
  const document = toDocument(doc)
  const queries = getQueries(document);
  return queries.find((query) => getName(query) === name);
}
