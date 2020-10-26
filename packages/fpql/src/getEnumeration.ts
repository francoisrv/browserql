import { DocumentNode } from 'graphql'

import getEnumerations from './getEnumerations'
import getName from './getName'

export default function getEnumeration(name: string) {
  return (schema: DocumentNode) =>
    getEnumerations(schema).find((enumeration) => getName(enumeration) === name)
}
