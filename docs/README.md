# browserql

Use graphql in the browser 🚀

## Abstract

Wouldn't it be cool to use [GraphQL](https://graphql.org/) as a state manager for browser apps?

Or have you ever worked in a front-end app that does not use GraphQL as a back-end and end up missing using Apollo to handle your state?

### Introducing browserql

You could benefit from GraphQL's schema syntax to model your data, and [Apollo's cache](https://www.apollographql.com/docs/react/caching/cache-interaction/) to store your data dynamically.

You could use as a drop-in replacement for other state managements solutions such as [Redux](https://redux.js.org/).

Note that this is a solution in case you are **not** using GraphQL already in the back-end -- even though it should be possible to use both.

Use this for any other back-end management (http, sockets) -- or none at all.

## Usage

Let's use a todo app to illustrate:

```js
import connect from '@browserql/client'
import gql from 'graphql-tag'

// schema can be a string or a GraphQL Document Node object
const schema = gql`
  // Put here the schema for a todo
  type Todo {
    name: String!
  }

  type Query {
    // get all todos
    getTodos: [Todo!]!
  }

  type Mutation {
    // add a new todo
    addTodo(name: String!)
  }
`

const queries = {
  async getTodos() {
    // Get todos somehow, ie http
    return get('/api/todos')
  },
}

const mutations = {
  async addTodo(todo) {
    // Update todos somehow, ie http
    return post('/api/todos', { todo })
  },
}

// Create a new browserql client
const client = connect({ schema, queries, mutations })

// You can now access the apollo client as you would normally do:
await client.query({
  query: gql`
    query {
      getTodos {
        name
      }
    }
  `,
})
```
