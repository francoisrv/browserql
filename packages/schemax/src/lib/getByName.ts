import { DocumentNode } from 'graphql';
import getName from './getName';

export default function getByName(document: DocumentNode, name: string) {
  const { definitions } = document;
  return definitions.find((def) => getName(def) === name);
}
