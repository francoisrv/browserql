import * as React from 'react'
import Code from './Code'

interface Props {
  doc: string
}

export default function Run(props: Props) {
  const md = require(`../doc/${props.doc}.md`)
  return <Code language="json" value={JSON.stringify(props, null, 2)} />
}
