import React, { useContext } from 'react'
import State from '@browserql/state-react'
import { BrowserqlContext } from '@browserql/react'
import { PRINT_SCHEMA } from '../queries'
import Code from '@browserql/components/Code'

export default function Preview() {
  const ctx = useContext(BrowserqlContext)
  return (
    <State schema={ctx.schema} cache={ctx.cache} query={PRINT_SCHEMA}>
      {(state) => (
        <Code language="graphql" value={state.get().printSchema || ''} />
      )}
    </State>
  )
}
