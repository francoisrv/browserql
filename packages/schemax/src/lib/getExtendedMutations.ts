import { DefinitionNode, DocumentNode } from 'graphql';
import getName from './getName';

export default function getExtendedMutations(
  document: DocumentNode
): DefinitionNode[] {
  const { definitions } = document;
  return definitions.filter(
    (def) => def.kind === 'ObjectTypeExtension' && getName(def) === 'Mutation'
  );
}
