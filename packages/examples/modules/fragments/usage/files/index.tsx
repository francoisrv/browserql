import Code from '@browserql/components/Code'
import React from 'react'
import fragment from './index.mjs'

export default function App() {
  return <Code language="graphql" value={fragment} />
}

App.height = 280
