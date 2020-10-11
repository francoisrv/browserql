# rest

```graphql
type Todo @rest {
  id: ID!
  name: String!
  done: Boolean! @default(value: false)
}
```

```js
import connect from '@browserql/client'
import connectRest from '@browserql/rest'

import schema from './schema.graphql'

export const client = connect(
  connectRest({
    schema,
    baseUrl: 'https://api.com/v1',
  })
)
```

```js
import { exposeRest } from '@browserql/rest'

import { client } from './client'

const rest = exposeRest(client)

await rest.get.Todo('123') // GET https://api.com/v1/todo/123
await res.get.Todo() // GET https://api.com/v1/todo
await res.post.Todo({ name: 'Buy milk' }) // POST https://api.com/v1/todo { name: 'Buy milk' }
```

```jsx
import React from 'react'
import { render } from 'react-dom'
import { Restql, useRest } from '@browserql/rest-react'

function Todos() {
  return (
    <Restql
      get="Todo"
      render={(todos) => (
        <ul>
          {todos.map((todo) => (
            <li>{todo.name}</li>
          ))}
        </ul>
      )}
    />
  )
}

function AddTodo(props) {
  return (
    <Restql
      post="Todo"
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
