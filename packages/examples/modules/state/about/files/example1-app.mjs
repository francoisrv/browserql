import React from 'react'
import State from '@browserql/state-react'

export default function App() {
  return (
    <State query="getCounter">
      {(getCounter) => (
        <button onClick={getCounter.increment}>{getCounter.get()}</button>
      )}
    </State>
  )
}