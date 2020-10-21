import { DocumentNode, ObjectTypeDefinitionNode } from 'graphql';
import getName from './getName';

export default function getTypes(document: DocumentNode): ObjectTypeDefinitionNode[] {
  const { definitions } = document;
  const next = definitions
    .filter((def) => def.kind === 'ObjectTypeDefinition' || def.kind === 'ObjectTypeExtension')
    .filter((def) => getName(def) !== 'Query' && getName(def) !== 'Mutation');
  return next as ObjectTypeDefinitionNode[]
}
