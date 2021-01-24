import React from 'react'
import Code from '@browserql/components/Code'

export default function GetArgument() {
  return <Code language="json" value={JSON.stringify([123], null, 2)} />
}
