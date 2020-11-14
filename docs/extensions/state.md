# State

State management based on apollo cache

## Usage

```js
import connectState from '@browserql/state'

const client = new ApolloClient({
  typeDefs: gql`
    type Todo @model {
      name: String
    }
  `,
})

const state = connectState(client.cache)

// get
state.get('isLoggedIn', { user: '1234' }) // false

state.toggle('isLoggedIn', { user: '1234' })

state.get('isLoggedIn', { user: '1234' }) // true
```

```jsx
import React from 'react'
import gql from 'graphql-tag'
import { BrowserqlProvider } from '@browserql/react'
import { ModelQL } from '@browserql/state'
import ForEach from '@browserql/foreach'

const schema = gql`
  type Todo @model {
    name: String!
    done: Boolean! @default(value: false)
  }
`

function Todos() {
  return (
    <Model model="Todo">
      {Todo => (
        <ul>
          <UseState initial="">
            {(name, setName) => (
              <li>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  type="button"
                  value="Add"
                  onClick={() => Todo.addOne({ name })}
                />
              </li>
            )}
          </UseState>
          <ForEach map={Todo.get({ done: false })}>{todo => (
            <li key={todo.name}>
              <input
                type="text"
                value={todo.name}
                onChange={e => Todo.updateById(todo.id, { name: e.target.value })}
              />
              <button onClick={() => Todo.pull(todo.id) }>
                Delete
              </button>
            </li>
          )}</ForEach>
        </ul>
      )}
    </Model>
  )
  return (
    <Stateql state="State.isLoggedIn">
      {isLoggedIn => (
        <input
          type="checkbox"
          checked={isLoggedIn.get()}
          onChange={isLoggedIn.toggle}
        />
      )}
    </Stateql>
  )
  return (
    <Stateql state="State.counter">
      {counter => (
        <>
          <input
            type="button"
            value="-"
            onClick={counter.decrement}
          />
          <input
            type="number"
            value={counter.get()}
          />
          <input
            type="button"
            value="+"
            onClick={counter.increment}
          />
        </>
      )}
    </Stateql>
  )
  return (
    <Stateql state="State">
      {state => (
        <>
          <input
            type="button"
            value="-"
            onClick={state.counter.decrement}
          />
          <input
            type="number"
            value={state.counter.get()}
          />
          <input
            type="button"
            value="+"
            onClick={state.counter.increment}
          />
        </>
      )}
    </Stateql>
  )
  return (
    <ModelQL get="Todo" where={{ done: false }}>
      {todos => (
        <ul>
          <ForEach map={todos}>
            {todo => <li key={todo.name}>{todo.name}</li>}
          </ForEach>
        </ul>
      )}
    </ModelQL>
  )
}

function AddTodo() {
  const [name, setName] = useState('')

  return (
    <ModelQL push="Todo">
      {pushTodo => (
        <>
          <input value={name} onChange={e => setName(e.target.value)} />
          <input type="submit" onClick={() => pushTodo({ name })}>
        </>
      )}
    </ModelQL>
  )
}

render(
  <Browserql.Provider {...connectState({ schema })}>
    <>
      <Todos />
      <AddTodo />
    </>
  </Browserql.Provider>,
  document.getElementById('root'),
)
```

## API

### get

### change

### toggle

### increment

### multiply

### concat

### push

```js
const schema = gql`
  type Foo {
    name: String!
  }

  type Query {
    ids: [ID]
    foos: [FOO]
  }
`

state.push('ids', 1)
state.push('foos', { name: 'joe' })
state.filter('foos', { name: 'joe' })
```

### pull

### set

```js
const schema = gql`
  type Foo {
    name: String!
  }

  type Query {
    ids: [ID]
    foos: [FOO]
  }
`

state.push('ids', 1)
state.push('foos', { name: 'joe' })
```
