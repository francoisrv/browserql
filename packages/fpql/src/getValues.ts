import { DirectiveNode } from 'graphql'

import getArguments from './getArguments'

export default function getValues(directive: DirectiveNode) {
  const args = getArguments(directive)
  if (!args.length) {
    return {}
  }
}