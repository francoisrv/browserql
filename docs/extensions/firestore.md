# Firestore

```gql
type Todo @firestore {
  name: String!
  done: Boolean!
}
```

## Usage

### Connect firestore with browserql

```js
import connect from '@browserql/client'
import connectFirestore from '@browserql/firestore'

import schema from './schema.graphql'

// Import your firebase config and initializer here

const client = connect(connectFirestore({ schema }))
```

### Use the firestore object

```js
import { exposeFirestore, where } from '@browserql/firestore'

const firestore = exposeFirestore(client)

await firestore
  .model('Todo')
  .paginate(where('done').equals(false), { size: 10, orderBy: 'name' })

await firestore.model('Todo').add({ name: 'Buy milk', done: false })
```

### With React

```js
import React, { useState } from 'react'
import { render } from 'react-dom'
import { where } from '@browserql/firestore'
import { BrowserqlProvider } from '@browserql/react'
import { Firestoreql } from '@browserql/firestore-react'
import connectFirestore from '@browserql/firestore'

import schema from './schema.graphql'

function Todos() {
  return (
    <Firestoreql
      paginate="Todo"
      where={[where('done').equals(false)]}
      size={10}
      orderBy="name"
      render={(todos) => (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      )}
    />
  )
}

function AddTodo() {
  const [name, setName] = useState('')
  return (
    <Firestoreql
      add="Todo"
      render={(addTodo, { loading, error }) => (
        <form>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input
            type="submit"
            onClick={() => addTodo(name)}
            disabled={loading}
          />
        </form>
      )}
    />
  )
}

render(
  <BrowserqlProvider {...connectFirestore({ schema })}>
    <Todos />
    <AddTodo />
  </BrowserqlProvider>
)
```
