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
    | ArgumentNode
    | DefinitionNode
    | FieldDefinitionNode
    | InputValueDefinitionNode
    | ObjectFieldNode
    | TypeNode
    | SelectionNode
): string {
  if ('name' in type) {
    const { name } = type;
    if (name) {
      return name.value;
    }
  }
  throw new Error('Could not get name from type');
}
