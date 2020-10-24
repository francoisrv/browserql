import { FieldDefinitionNode } from 'graphql';
import getDirectives from './getDirectives';
import getName from './getName';

export default function getDirective(name: string) {
  return (field: FieldDefinitionNode) => getDirectives(field)
    .find(directive => getName(directive) === name)
}