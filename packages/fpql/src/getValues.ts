import { ArgumentNode, DirectiveNode, ObjectFieldNode, VariableNode } from 'graphql'

import getArguments from './getArguments'
import getName from './getName'

function getValue(arg: ArgumentNode | ObjectFieldNode | VariableNode): any {
  const x = 'value' in arg ? arg.value : arg
  if ('value' in x) {
    return x.value
  }
  if ('fields' in x) {
    return x.fields.reduce(
      (object, field) => ({
        ...object,
        [getName(field)]: getValue(field)
      }),
      {}
    )
  }
  if ('values' in x) {
    return (x.values as VariableNode[]).map(getValue)
  }
}

export default function getValues(directive: DirectiveNode) {
  const args = getArguments(directive)
  if (!args.length) {
    return {}
  }
  const next = [...args].reduce(
    (list, arg) => ({
      ...list,
      [getName(arg)]: getValue(arg as ArgumentNode)
    }),
    {},
  )
  return next
}