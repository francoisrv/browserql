# State

## Usage

```graphql
// schema.graphql

type Todo {
  id: ID!
}

type State @state {
  isLoggedIn: Boolean!
  selectedTodo: Todo
  counter: Int!
}
```

```js
const client = connect({ schema }, connectState())

const state = exposeState(client)

await state.get.isLoggedIn()

await state.toggle.isLoggedIn()

await state.increment.counter()
```

## API

### get

### change

### toggle

### increment

### multiply

### concat

### push

### pull
