# firestore react

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
      dontRenderLoading
      dontRenderError
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
            onClick={() => addTodo({ name })}
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
