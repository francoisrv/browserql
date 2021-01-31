import React from 'react'
import type { DocumentNode } from 'graphql'
import { getName, getTypes } from '@browserql/fpql'
import TypeComposer from './components/TypeComposer'

interface Props {
  schema: DocumentNode
}

export default function SchemaComposer({ schema }: Props) {
  const types = getTypes(schema)
  return (
    <div>
      {types.map((type) => (
        <TypeComposer type={type} key={getName(type)} />
      ))}
    </div>
  )
}
