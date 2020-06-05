browserql-state-react-hook
===

React hook to use with the browsrql state plugin

## Demo

```js
import React from 'react'
import ReactDOM from 'react-dom'
import gql from 'graphql-tag'
import connect from '@browserql/client'
import state from '@browserql/state'
import Provider from '@browserql/react-provider'
import { useState } from '@browserql/state-react-hooks'

const schema = gql`
type App @state { version: String! @default(value: "1.0.0") }
`
const plugins = [
  state()
]
const client = connect({ schema, plugins })

ReactDOM.render(
  <Provider client={ client }>
    <App />
  </Provider>
)

function App() {
  const version     =   useState('App.version')
  const [state]     =   version.get()
  const [setState]  =   version.set()
  
  return (
    <input
      value={ state }
      onChange={ e => setState(e.target.value) }
    />
  )
}
```