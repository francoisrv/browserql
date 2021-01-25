import Code from '@browserql/components/Code'
import React from 'react'
import { print } from 'graphql'

import example from './example.mjs'

export default function Example() {
  return <Code language="graphql" value={print(example)} />
}

Example.height = 220
