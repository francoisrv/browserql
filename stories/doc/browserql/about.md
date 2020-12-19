# browserql

`browserql` is a suite of packages all related to **running a GraphQL server in the browser**.

## Why?

graphql offers a very interesting ecosytem, but can only be used in a front-end app if it is connected to a GraphQL HTTP/web socket server.

By creating an in-browser-memory GraphQL server, you can use the empowering syntax of GraphQL and the efficiency of the Apollo cache for pretty much everything!

## Show me some examples

### Organize your http queries

Connecting to a REST api? Convert it to GraphQL!

```graphql
type Todo {
  name: String!
}

type Query {
  getTodos: [Todo!]! @httpGet(url: "http://api.com/v1/todos")
}
```

### Connect to Firebase Firestore

```graphql
type Todo @firestore {
  name: String!
  done: Boolean! @default(value: false)
}
```

```javascript
await client.query(get('Todo', where('done').equals(false)))
await client.mutate(add('Todo', { name: 'buy milk' }))
```

### Use it a state manager

```graphql
type State @state {
  isLoggedIn: Boolean! @default(value: false)
}
```

```javascript
await client.query(getState('State.isLoggedIn'))
await client.mutate(toggleState('State.isLoggedIn'))
```
