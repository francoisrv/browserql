import { FieldDefinitionNode } from 'graphql';

export default function getArguments(query: FieldDefinitionNode) {
  const { arguments: args = [] } = query;
  return args;
}
