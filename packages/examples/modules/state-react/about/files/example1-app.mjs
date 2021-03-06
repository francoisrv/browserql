import React from 'react'
import State from '@browserql/state-react'
import { parse } from 'graphql'

const CacheState = make(cache, schema)

export default function Counter() {
  return (
    <CacheState query={getCounter} select="getCounter">
      {(counter, setCounter) => (
        <button onClick={setCounter.increment}>{counter}</button>
      )}
    </CacheState>
  )
}
