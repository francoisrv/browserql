# Firestoreql with React

## Components

```jsx
import React from 'react'
import { render } from 'react-dom'
import { build, set } from '@browserql/firestore'
import { BrowserqlProvider } from '@browserql/react'
import { Firestoreql } from '@browserql/firestore-react'

function Todos() {
  return (
    <Firestoreql get="Todo" limit={10}>
      {(todos) => (
        <ul>
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </Firestoreql>
  )
}

function Todo({ todo }) {
  return (
    <li>
      <Firestoreql update="Todo">
        {(update) => (
          <input
            type="checkbox"
            checked={false}
            onChange={() => update(set('done').to(true))}
          />
        )}
      </Firestoreql>
      {todo.name}
    </li>
  )
}

function AddTodo() {
  const [name, setName] = React.useState('')
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <Firestoreql add="Todo">
        {(add) => <button onClick={() => add({ name })}>Add</button>}
      </Firestoreql>
    </>
  )
}

render(
  <BrowserqlProvider {...build(db, schema)}>
    <AddTodo />
    <Todos />
  </BrowerqlProvider>
)
```

## With HOC

```javascript
import React from 'react'
import { render } from 'react-dom'
import { flow } from 'lodash'
import { build, set } from '@browserql/firestore'
import { BrowserqlProvider } from '@browserql/react'
import { withFirestoreql } from '@browserql/firestore-react'

function TodosView({ todos, updateTodo, addTodo }) {
  const [name, setName] = React.useState('')

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={false}
              onChange={() => updateTodo(set('done').to(true))}
            />
            {todo.name}
          </li>
        ))}
      </ul>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => addTodo({ name })}>Add</button>
    </>
  )
}

const Todos = flow(
  withFirestore.get('Todo').as('todos'),
  withFirestore.update('Todo').as('updateTodo'),
  withFirestore.add('Todo').as('addTodo')
)(TodosView)

render(
  <BrowserqlProvider {...build(db, schema)}>
    <Todos />
  </BrowerqlProvider>
)
```

## With Hooks

```javascript
import React from 'react'
import { render } from 'react-dom'
import { build, set } from '@browserql/firestore'
import { BrowserqlProvider } from '@browserql/react'
import { useFirestoreql } from '@browserql/firestore-react'

function Todos() {
  const [name, setName] = React.useState('')
  const [todos] = useFirestoreql.get('Todo')
  const [updateTodo] = useFirestoreql.update('Todo')
  const [addTodo] = useFirestoreql.add('Todo')

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={false}
              onChange={() => updateTodo(set('done').to(true))}
            />
            {todo.name}
          </li>
        ))}
      </ul>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => addTodo({ name })}>Add</button>
    </>
  )
}

render(
  <BrowserqlProvider {...build(db, schema)}>
    <Todos />
  </BrowerqlProvider>
)
```
