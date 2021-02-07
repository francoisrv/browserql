import React from 'react'
import State from '@browserql/state-react'
import { parse } from 'graphql'

export default function App() {
  return (
    <State query={parse('{ getCounter }')}>
      {(state) => (
        <button onClick={state.increment}>{state.get().getCounter}</button>
      )}
    </State>
  )
}
