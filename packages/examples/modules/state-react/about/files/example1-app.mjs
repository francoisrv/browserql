import React from 'react'
import State from '@browserql/state-react'
import gql from 'graphql-tag'

export default function App() {
  return (
    <State
      query={gql`
        {
          getCounter
        }
      `}
    >
      {(getCounter) => (
        <button onClick={getCounter.increment}>{getCounter.get()}</button>
      )}
    </State>
  )
}
