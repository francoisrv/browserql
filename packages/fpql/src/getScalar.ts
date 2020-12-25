import { DocumentNode } from 'graphql'
import getName from './getName'
import getScalars from './getScalars'

export default function getScalar(name: string) {
  return function (schema: DocumentNode) {
    return getScalars(schema).find((scalar) => getName(scalar) === name)
  }
}
