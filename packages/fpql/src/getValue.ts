import type { ArgumentNode } from 'graphql'
import printValue from './printValue'

export default function getValue(arg: ArgumentNode): any {
  return printValue(arg.value)
}
