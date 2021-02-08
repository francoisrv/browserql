import React, { useContext } from 'react'
import State from '@browserql/state-react'
import { BrowserqlContext } from '@browserql/react'
import { GET_DEFINITIONS, PRINT_SCHEMA } from '../queries'
import Code from '@browserql/components/Code'
import { Definition } from '../types'

function printSchema(definitions: Definition[]) {
  return definitions.map((def) => `${def.kind} ${def.name}`).join('\n')
}

export default function Preview() {
  const ctx = useContext(BrowserqlContext)
  return (
    <State schema={ctx.schema} cache={ctx.cache} query={GET_DEFINITIONS}>
      {(state) => (
        <Code
          language="graphql"
          value={printSchema(state.get().getDefinitions)}
        />
      )}
    </State>
  )
}
