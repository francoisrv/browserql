import { FieldDefinitionNode } from 'graphql';
import getArguments from './getArguments';
import getName from './getName';

export default function getArgument(name: string) {
  return (field: FieldDefinitionNode) => {
    // @ts-ignore
    return getArguments(field).find(arg => getName(arg) === name)
  }
}