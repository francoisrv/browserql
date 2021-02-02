import React, { useState } from 'react'
import type { DocumentNode } from 'graphql'
import { getName, getTypes } from '@browserql/fpql'
import TypeComposer from './components/TypeComposer'
import AddComposer from './components/AddComposer'
import DefinitionCard from './components/DefinitionCard'

interface Props {
  schema: DocumentNode
}

export default function SchemaComposer({ schema }: Props) {
  const [definitions, setDefinitions] = useState(schema.definitions)
  return (
    <div style={{ padding: 16 }}>
      {definitions.map((definition) => (
        <div key={getName(definition)}>
          <DefinitionCard definition={definition} />
        </div>
      ))}
    </div>
  )
}
