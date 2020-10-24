import { DirectiveDefinitionNode, DirectiveNode, DocumentNode, FieldDefinitionNode } from 'graphql';
import { getName } from '..';
import getDirectives from './getDirectives';

export default function getDirective(document: DocumentNode, name: string): DirectiveDefinitionNode | undefined

export default function getDirective(field: FieldDefinitionNode, name: string): DirectiveNode | undefined

export default function getDirective(
  document: DocumentNode | FieldDefinitionNode,
  name: string,
): DirectiveDefinitionNode | DirectiveNode | undefined {
  return getDirectives(document).find(directive => getName(directive) === name)
}