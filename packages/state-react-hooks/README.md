browserql-state-react-hook
===

React hook to use with the browsrql state plugin

## Demo

```js
import React from 'react'
import ReactDOM from 'react-dom'
import gql from 'graphql-tag'
import { connect } from 'browserql'
import state from 'browserql-state'
import Provider from 'browserql-react-provider'
import { useState } from 'browserql-state-react-hooks'

const schema = gql`
type App @state { name: String! }
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
  const name = useState('App.name')
  const [state] = name.get()
  const [setState] = name.set()
  return (
    <input
      value={ state }
      onChange={ e => setState(e.target.value) }
    />
  )
}
```