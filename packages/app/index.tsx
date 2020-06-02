import * as React from 'react'
import ReactDOM from 'react-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import GraphiQL from 'graphiql'

// import { Provider } from 'browserql-plugin-react/src'
import Provider from 'browserql-react-provider/src/Provider'
import { connect } from 'browserql/src'
import state from 'browserql-plugin-state/src'
import useState from 'browserql-state-react-hooks/src/useState'

import schema from './schema.graphql'


const client = connect({
  schema,
  // resolvers: {},
  plugins: [
    state
  ]
})

window.client = client

function App() {
  return (
    <div>
      <StringTest />
    </div>
  )
}

function StringTest() {
  const withName = useState('State.name')
  const [name, { loading, error }] = withName.get()
  const [setName] = withName.set()

  let content

  if (error) {
    content = <div>{ error.message }</div>
  } else if (loading) {
    content = <div>Loading</div>
  } else {
    content = (
      <input
        value={ name }
        onChange={ e => setName(e.target.value) }
      />
    )
  }

  return (
    <div>
      <h1>String</h1>
      { content }
    </div>
  )
}

function Counter() {
  const withCounter = useState('State.counter')
  const [counter] = withCounter.get()
  const [increment] = withCounter.increment()

  return (
    <div>
      <input
        type="number"
        defaultValue={ counter }
      />
      <input
        type="button"
        value="+"
        onClick={ () => increment() }
      />
    </div>
  )
}

ReactDOM.render(
  <Provider client={ client }>
    <App />
    <Counter />
  </Provider>,
  document.getElementById('root'),
)
