import Code from '@browserql/components/Code'
import React from 'react'
import result from './index.mjs'

export default function App() {
  return <Code language="json" value={JSON.stringify(result, null, 2)} />
}
