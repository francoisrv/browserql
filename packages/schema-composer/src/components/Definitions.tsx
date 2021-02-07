import { BrowserqlContext } from '@browserql/react'
import React from 'react'
import { useContext } from 'react'
import State from '@browserql/state-react'
import { GET_DEFINITIONS } from '../queries'
import Code from '@browserql/components/Code'
import Each from './Each'
import DefinitionCard from './DefinitionCard'
import { Definition } from '../types'

export default function Definitions() {
  const ctx = useContext(BrowserqlContext)
  return (
    <State<undefined, { getDefinitions: Definition[] }>
      schema={ctx.schema}
      cache={ctx.cache}
      query={GET_DEFINITIONS}
    >
      {(getDefinitions) => (
        <Each<Definition> of={getDefinitions.get().getDefinitions}>
          {(definition) => (
            <DefinitionCard key={definition.id} id={definition.id} />
          )}
        </Each>
      )}
    </State>
  )
}
