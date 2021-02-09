import React, { useContext } from 'react'
import State from '@browserql/state-react'
import BrowserqlContext from '@browserql/react/dist/contexts/BrowserqlContext'

export default function Fields() {
  const ctx = useContext(BrowserqlContext)
  return <State schema={ctx.schema} cache={ctx.cache}></State>
}
