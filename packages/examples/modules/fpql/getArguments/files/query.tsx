import React from 'react'
import Code from '@browserql/components/Code'
import ARGS from './query.mjs'

export default function Fields() {
  return <Code language="json" value={JSON.stringify(ARGS, null, 2)} />
}

Fields.height = 430
