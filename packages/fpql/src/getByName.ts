import { DocumentNode } from 'graphql';
import getName from './getName';
import toDocument from './toDocument';

export default function getByName(name: string) {
  return (doc: string | DocumentNode) => {
    const document = toDocument(doc)
    const { definitions } = document;
    return definitions.find((def) => getName(def) === name);
  }
}