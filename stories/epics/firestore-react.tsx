import { BrowserqlProvider } from '@browserql/react'
import * as React from 'react'
import { Firestoreql } from '@browserql/firestore-react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { connectFirestore, where } from '@browserql/firestore'
import gql from 'graphql-tag'
import connectScalars from '@browserql/scalars'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_BASEURL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = firebase.firestore()

const schema = gql`
  type Todo @firestore(collection: "todos438538483") {
    name: String!
    date: DateTime!
  }
`

export const Usage = (props: any) => {
  const { children } = props
  const [date, setDate] = React.useState()
  const [priority, setPriority] = React.useState()
  return children({ date, setDate, priority, setPriority })
}

function Got() {
  const [date, setDate] = React.useState(new Date())
  const [operator, setOperator] = React.useState('isLesserThan')

  return (
    <div>
      <select value={operator} onChange={(e) => setOperator(e.target.value)}>
        <option value="isLesserThan">Is lesser than</option>
        <option value="isLesserThanOrEqualTo">Is lesser than or equal</option>
        <option value="isGreaterThan">Is greater than</option>
        <option value="isGreaterThanOrEqual">Is greater than or equal</option>
      </select>
      <input
        type="date"
        value="12/01/2020"
        onChange={(e) => setDate(new Date(e.target.value))}
      />
      <Firestoreql
        paginate="Todo"
        where={[where('date')[operator as 'isLesserThan'](date)]}
        renderError={(error) => <div>{error.message}</div>}
      >
        {(todos) => (
          <div>
            <h4>{todos.length} todos</h4>
            <ul>
              {console.log({ todos })}
              {todos.map((todo) => (
                <li key={todo.id}>
                  {todo.name} {new Date(todo.date.seconds * 1000).toString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Firestoreql>
    </div>
  )
}

export const WherePriorityIsLesserGreater = () => {
  return (
    <Usage>
      {() => (
        <BrowserqlProvider
          extensions={[connectScalars(), connectFirestore(db, schema)]}
        >
          <Got />
        </BrowserqlProvider>
      )}
    </Usage>
  )
}
