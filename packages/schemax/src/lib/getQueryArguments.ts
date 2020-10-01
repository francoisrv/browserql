import { FieldDefinitionNode } from 'graphql';

export default function getQueryArguments(query: FieldDefinitionNode) {
  const { arguments: args = [] } = query;
  return args;
}
