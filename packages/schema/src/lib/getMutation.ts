import { DocumentNode } from 'graphql';
import getName from './getName';
import getMutations from './getMutations';

export default function getMutation(document: DocumentNode, name: string) {
  const mutations = getMutations(document);
  return mutations.find((query) => getName(query) === name);
}
