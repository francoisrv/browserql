import { ArgumentNode, DirectiveNode, ObjectFieldNode } from 'graphql'

import getArguments from './getArguments'
import getName from './getName'

function getValue(arg: ArgumentNode | ObjectFieldNode): any {
  if ('value' in arg.value) {
    return arg.value.value
  }
  if ('fields' in arg.value) {
    return arg.value.fields.reduce(
      (object, field) => ({
        ...object,
        [getName(field)]: getValue(field)
      }),
      {}
    )
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