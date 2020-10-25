import { DirectiveNode, FieldDefinitionNode } from 'graphql';

export default function getArguments(query: FieldDefinitionNode | DirectiveNode) {
  const { arguments: args = [] } = query;
  return args;
}
