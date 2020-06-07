import * as React from 'react'
import ReactDOM from 'react-dom'

import Provider from '@browserql/react-provider'
import firestore from '@browserql/firestore'
import { useFirestore } from '@browserql/firestore-react-hooks'

import schema from './firestore.graphql'

const plugins = [firestore()]

function Companies() {
  const [companies] = useFirestore('Company').find()

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

ReactDOM.render(
  <Provider schema={ schema } plugins={ plugins }>
    <App />
  </Provider>,
  document.getElementById('root')
)