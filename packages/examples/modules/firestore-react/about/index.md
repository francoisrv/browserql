```snapshot2
FirestoreReact.TryIt
```

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

### Properties

| Prop                                           | Description                                                                      | Type                                                                              | Example                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **get** \| **add** \| **update** \| **remove** | Put here the name of a type that has been tagged with the directive `@firestore` | `string`                                                                          | `<Firestoreql get="User" />`                                                   |
| **children**                                   | View below                                                                       | `<D = unknown>(data: D, info: { loading: boolean, error?: Error }): ReactElement` | `<Firestoreql get="User" first>{user => <div>{user.name}</div>}</Firestoreql>` |
| **where**                                      | View below                                                                       | `Where[]`                                                                         | `<Firestoreql get="User" where={[where('email').equals(email)]} />`            |
| **orderBy**                                    | View below                                                                       | `string`                                                                          | `<Firestoreql get="User" orderBy="createdAt" />`                               |
| **asc**                                        | View below                                                                       | `boolean`                                                                         | `<Firestoreql get="User" asc={false} />`                                       |

## With HOC

```javascript
import React from 'react'
import { render } from 'react-dom'
import { flow } from 'lodash'
import { build, set } from '@browserql/firestore'
import { BrowserqlProvider } from '@browserql/react'
import { withFirestoreql } from '@browserql/firestore-react'

function TodosView({ getTodo, updateTodo, addTodo }) {
  const [name, setName] = React.useState('')

  if (getTodo.loading) {
    return <div>Loading</div>
  }

  return (
    <>
      <ul>
        {getTodo.data.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={false}
              onChange={() => updateTodo.exec(set('done').to(true))}
            />
            {todo.name}
          </li>
        ))}
      </ul>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => addTodo.exec({ name })}>Add</button>
    </>
  )
}

const Todos = flow(
  withFirestore.get('Todo'),
  withFirestore.update('Todo'),
  withFirestore.add('Todo')
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
