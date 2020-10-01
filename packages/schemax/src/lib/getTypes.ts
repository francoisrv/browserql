import { DocumentNode, isTypeExtensionNode } from 'graphql';
import getName from './getName';

export default function getTypes(document: DocumentNode) {
  const { definitions } = document;
  return definitions
    .filter((def) => def.kind === 'ObjectTypeDefinition')
    .filter((def) => getName(def) !== 'Query' && getName(def) !== 'Mutation');
}
