import { DocumentNode, ObjectTypeDefinitionNode } from 'graphql';
import getName from './getName';
import getTypes from './getTypes';

export default function getType(
  document: DocumentNode,
  name: string
): ObjectTypeDefinitionNode | undefined {
  const types = getTypes(document);
  return types.find(
    (type): type is ObjectTypeDefinitionNode =>
      getName(type) === name && type.kind === 'ObjectTypeDefinition'
  );
}
