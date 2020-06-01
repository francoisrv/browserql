import * as React from 'react'
import ReactDOM from 'react-dom'
import { useQuery } from '@apollo/react-hooks'


import { Provider } from 'browserql-plugin-react/src'
import { connect } from 'browserql/src'
import state from 'browserql-plugin-state/src'

import schema from './schema.graphql'
import * as resolvers from './resolvers'
import * as queries from './queries'

interface QueryProps { query: keyof typeof queries, variables?: any }

function Query(props: QueryProps) {
  const { loading, error, data } = useQuery(queries[props.query], {
    variables: props.variables
  })
  let elem
  if (error) {
    elem = <span>{error.message}</span>
  } else if (loading) {
    elem = <span>loading</span>
  } else {
    elem = JSON.stringify(data)
  }
  return (
    <div>
      <h4>{ props.query }</h4>
      <div>
        { elem }
      </div>
    </div>
  )
}

const all: QueryProps[] = [
  {
    query: 'getState',
    variables: { state: 'name' }
  }
]

function App() {
  return (
    <div>
    {
      all.map(({ query, variables }) => (
        <Query
          key={ query }
          query={ query }
          variables={ variables }
        />
      ))
    }
    </div>
  )
}

const { client, transactions } = connect({
  schema,
  // resolvers: {},
  plugins: [
    state
  ]
})

window.client = client
window.transactions = transactions

ReactDOM.render(
  <Provider client={ client }>
    <App />
  </Provider>,
  document.getElementById('root'),
)