import React, { useState } from 'react'
import type { DocumentNode } from 'graphql'
import { getName, getTypes } from '@browserql/fpql'
import TypeComposer from './components/TypeComposer'
import AddComposer from './components/AddComposer'

interface Props {
  schema: DocumentNode
}

export default function SchemaComposer({ schema }: Props) {
  const [types, setTypes] = useState(getTypes(schema))
  return (
    <div>
      <AddComposer onAdded={(type) => setTypes([...types, type])} />
      {types.map((type) => (
        <TypeComposer type={type} key={getName(type)} />
      ))}
    </div>
  )
}
