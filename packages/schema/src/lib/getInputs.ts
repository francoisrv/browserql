import { DocumentNode, InputObjectTypeDefinitionNode, InputObjectTypeExtensionNode } from 'graphql';
import getName from './getName';

export default function getInputs(document: DocumentNode): (InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode)[] {
  const { definitions } = document;
  const next = definitions
    .filter((def) => def.kind === 'InputObjectTypeDefinition' || def.kind === 'InputObjectTypeExtension')
    .filter((def) => getName(def) !== 'Query' && getName(def) !== 'Mutation');
  return next as (InputObjectTypeDefinitionNode | InputObjectTypeExtensionNode)[]
}
