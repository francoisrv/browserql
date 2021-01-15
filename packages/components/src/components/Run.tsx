import * as React from 'react'
import Code from './Code'

interface Props {
  doc: string
}

export default function Run(props: Props) {
  const vars: Record<string, string> = {}
  return <div>{props.doc}</div>
}
