import Code from '@browserql/components/Code'
import React from 'react'
import DIRECTIVE from './main.mjs'

export default function Main() {
  return <Code language="json" value={JSON.stringify(DIRECTIVE, null, 2)} />
}

Main.height = 300
