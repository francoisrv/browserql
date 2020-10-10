import { DocumentNode } from 'graphql';
import find from 'lodash.find';
import getName from './getName';

export default function getRootQuery(document: DocumentNode) {
  const { definitions } = document;
  return find(
    definitions,
    (def) => def.kind === 'ObjectTypeDefinition' && getName(def) === 'Query'
  );
}
