import React from 'react'
import Code from '@browserql/components/Code'
import ARG from './directive.mjs'

export default function GetArgument() {
  return <Code language="json" value={JSON.stringify(ARG, null, 2)} />
}

GetArgument.height = 380
