import { ObjectTypeDefinitionNode } from 'graphql';

import getFields from './getFields'
import getName from './getName'

export default function getField(name: string) {
  return (type: ObjectTypeDefinitionNode) => getFields(type)
    .find(field => getName(field) === name)
}