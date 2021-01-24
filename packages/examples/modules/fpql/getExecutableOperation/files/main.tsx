import Code from '@browserql/components/Code'
import React from 'react'
import OP from './main.mjs'

export default function App() {
  return <Code language="json" value={JSON.stringify(OP, null, 2)} />
}

App.height = 370
