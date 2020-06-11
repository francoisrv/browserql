import * as React from 'react'
import ReactDOM from 'react-dom'

import Provider from '@browserql/react-provider'
import firestore from '@browserql/firestore'
import { useFirestore } from '@browserql/firestore-react-hooks'
import connect from '@browserql/client'

import schema from './firestore.graphql'

const plugins = [firestore()]

function Companies() {
  const [companies, { loading, error }] = useFirestore('Company').find()

  console.log({ companies, loading, error })

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
    </table>
  )
}

function App() {
  return (
    <div>
      <Companies />
    </div>
  )
}

const client = connect({ schema, plugins })

ReactDOM.render(
  <Provider client={ client }>
    <App />
  </Provider>,
  document.getElementById('root')
)