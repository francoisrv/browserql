import {
  ArgumentNode,
  DefinitionNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ObjectFieldNode,
  TypeNode,
  SelectionNode,
} from 'graphql';

export default function getName(
  type:
    | undefined
    | ArgumentNode
    | DefinitionNode
    | FieldDefinitionNode
    | InputValueDefinitionNode
    | ObjectFieldNode
    | TypeNode
    | SelectionNode
): string {
  if (typeof type === 'undefined') {
    return '';
  }
  if ('name' in type) {
    const { name } = type;
    if (name) {
      return name.value;
    }
  }
  return '';
}
