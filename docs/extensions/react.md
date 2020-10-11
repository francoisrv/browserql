# react

## Provider

### Example

```jsx
import React from 'react'
import { render } from 'react-dom'
import { BrowserqlProvider } from '@browserql/react'

render(
  <BrowserqlProvider schema={'type Query { hello: String! }'}>
    // ...
  </BrowserqlProvider>
)
```

## Hooks

## Components

### Browserql

```jsx
import React from 'react'
import Browserql from '@browserql/react'

function UseQuery() {
  return (
    <Browserql
      query="getTodos"
      variables={{}}
      renderLoading="Loading"
      renderError="Error"
      render={(todos, { loading, error }) => (
        <ul>
          {todos.map((todo) => (
            <li>{todo.name}</li>
          ))}
        </ul>
      )}
    />
  )
}

function UseMutation(props) {
  return (
    <Browserql
      mutate="addTodo"
      renderLoading="Loading"
      renderError="Error"
      render={(addTodo, { loading, error }) => (
        <button
          onClick={() => addTodo({ name: props.name })}
          disabled={loading}
        >
          Add todo
        </button>
      )}
    />
  )
}
```
