import Code from '@browserql/components/Code'
import React from 'react'
import QUERY from './query.mjs'
import { print } from 'graphql'

export default function App() {
  return <Code language="graphql" value={print(QUERY)} />
}

App.height = 400
