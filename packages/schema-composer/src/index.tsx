import React, { useCallback, useState } from 'react'
import { print, DocumentNode } from 'graphql'
import { getName, getTypes } from '@browserql/fpql'
import Code from '@browserql/components/Code'
import TypeComposer from './components/TypeComposer'
import AddComposer from './components/AddComposer'
import DefinitionCard from './components/DefinitionCard'
import { sortBy } from 'lodash'

interface Props {
  schema: DocumentNode
}

export default function SchemaComposer({ schema }: Props) {
  const [definitions, setDefinitions] = useState(
    sortBy(schema.definitions, getName)
  )
  const handleChange = useCallback(
    (name, nextDefinition) => {
      if (name && nextDefinition) {
        const nextDefinitions = definitions.map((def) => {
          if (getName(def) === name) {
            return nextDefinition
          }
          return def
        })
        setDefinitions(sortBy(nextDefinitions, getName))
      } else if (name) {
        const nextDefinitions = definitions.filter(
          (def) => getName(def) !== name
        )
        setDefinitions(sortBy(nextDefinitions, getName))
      } else {
        const nextDefinitions = [...definitions, nextDefinition]
        setDefinitions(sortBy(nextDefinitions, getName))
      }
    },
    [definitions]
  )
  return (
    <div style={{ padding: 16, backgroundColor: '#333' }}>
      <DefinitionCard onChange={handleChange} />
      {definitions.map((definition, indexByName) => (
        <div key={indexByName}>
          <DefinitionCard definition={definition} onChange={handleChange} />
        </div>
      ))}
      <Code language="graphql" value={print({ ...schema, definitions })} />
    </div>
  )
}
