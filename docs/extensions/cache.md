# Cache

## Abstract

With cache, you deal directly with the apollo cache.

Queries are synchronous getters of the cache.

Mutations can update the cache and run asynchronous side effects.

## Usage

```js
import gql from 'graphql-tag'
import connect from '@browserql/client'
import { connectCache, exposeCache } from '@browserql/cache'

const schema = gql`
  type Todo {
    name: String!
  }

  type Query {
    getTodos: [Todo] @cache
  }

  type Mutation {
    addTodo(name: String!): void
  }
`

const mutations = {
  async addTodo({ name }, { cache }) {
    cache.push({
      query: 'getTodo',
      data: { name },
    })
  },
}

const client = connect(connectCache({ schema }))
const cache = exposeCache(client)

//

cache.query.getTodos() // []

await cache.mutate.addTodo({ name: 'Buy milk' })

cache.query.getTodos() // [{ name: 'Buy milk' }]
```

## With React

```js
import React from 'react'
import { render } from 'react-dom'
import { BrowserqlProvider } from '@browserql/react'
import { useCache } from '@browserql/cache-react'

function Todos() {
  const todos = useCache.query('getTodos')

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.name}>{todo.name}</li>
      ))}
    </ul>
  )
}

function AddTodo() {
  const [value, setValue] = React.useState(value)
  const [addTodo, { loading, error, data }] = useCache.mutate('addTodo')

  const handleSubmit = () => {
    addTodo({ name: value })
  }

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <input type="submit" onClick={handleSubmit} disabled={loading} />
    </>
  )
}

render(
  <BrowserqlProvider client={client}>
    <AddTodo />
    <Todos />
  </BrowserqlProvider>
)
```
