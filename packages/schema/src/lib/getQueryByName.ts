import { DocumentNode } from 'graphql';
import getName from './getName';
import getQueries from './getQueries';

export default function getQueryByName(document: DocumentNode, name: string) {
  const queries = getQueries(document);
  return queries.find((query) => getName(query) === name);
}
