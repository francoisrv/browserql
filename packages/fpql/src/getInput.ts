import { DocumentNode } from 'graphql'

import getInputs from './getInputs'
import getName from './getName'

export default function getInput(name: string) {
  return (schema: DocumentNode) =>
    getInputs(schema).find((input) => getName(input) === name)
}
