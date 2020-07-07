# Concepts

**browserql is not a graphql client to a graphql server**

Instead, it is its own client/server all happening in the browser.

## Advantages of GraphQL

- straight-forward syntax
- relied on a strong open-source community
- strong in-memory state management via the [apollo cache](https://www.apollographql.com/docs/react/caching/cache-interaction/)

Here's an example of todo app with browserql:

```graphql
type Todo {
  name: String!
}

type Query {
  getTodos: [ Todo ]
}

type Mutation {
  addTodo(name: String!): Todo
  @write(query: "getTodos" data: { name: "name" @arg })
}
```

```js
const client = connect({ schema })

client.query('getTodos') // []
await client.mutate('addTodo', { name: 'Buy milk' })
client.query('getTodos') // ["Buy milk"]
```
