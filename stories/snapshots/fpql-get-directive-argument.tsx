import * as React from 'react'
import gql from 'graphql-tag'
import { getArgument, getDirective, getType } from '@browserql/fpql'
import type { ObjectTypeDefinitionNode } from 'graphql'

import Code from '../components/Code'

const schema = gql`
  type A @foo(bar: 24) {
    id: ID!
  }
`

const type = getType('A')(schema)
const directive = getDirective('foo')(type as ObjectTypeDefinitionNode)
const arg = getArgument('bar')(directive)

export default function FPQLGetDirectiveArgument() {
  return <Code language="json" value={JSON.stringify(arg, null, 2)} />
}
