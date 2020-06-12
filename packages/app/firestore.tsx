import * as React from 'react'
import ReactDOM from 'react-dom'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import Provider from '@browserql/react-provider'
import firestore from '@browserql/firestore'
import { useFirestore } from '@browserql/firestore-react-hooks'
import connect from '@browserql/client'

// import schema from './firestore.graphql'

const schema = `
type Company @firestore {
  name: String!
}
`

firebase.initializeApp({
  apiKey: 'AIzaSyDxx1IiOnwgZZzE0_YlGmCGGITQGL-VnQA',
  projectId: 'lestudio-75c34',
  appId: '1:337318935047:web:4ca842544422cc8c30c8a2',
  authDomain: 'lestudio-75c34.firebaseapp.com'
})

const plugins = [firestore(firebase.firestore())]

function Companies() {
  const [companies, { loading, error }] = useFirestore('Company').find()

  console.log({ companies, loading, error })

  if (error) {
    return (
      <div>
        { error.message }
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
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
