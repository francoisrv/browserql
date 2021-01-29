import Code from '@browserql/components/Code'
import React from 'react'
import MUTATION from './mutation.mjs'
import { print } from 'graphql'

export default function App() {
  return <Code language="graphql" value={print(MUTATION)} />
}

App.height = 400
