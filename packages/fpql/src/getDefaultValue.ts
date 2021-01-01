import type { InputValueDefinitionNode } from 'graphql'
import printValue from './printValue'

export default function getDefaultValue(arg: InputValueDefinitionNode) {
  return typeof arg.defaultValue === 'undefined'
    ? undefined
    : printValue(arg.defaultValue)
}
