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
type App @state {
  name:       String!
  private:    Boolean!  @default(value: false)
  stars:      Int!      @default(value: 0)
}
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
  const nameState = useState('App.name')
  const [name] = nameState.get()
  const [setName] = nameState.set()
  return (
    <form>
      <input
        value={ name }
        onChange={ e => setName(e.target.value) }
      />
    </form>
  )
}
```