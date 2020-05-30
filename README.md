browserql
===

Use graphql in the browser as a state manager.

```ts
import { connect } from '@browserql/core'

let flag = false

const client = connect({
  schema: `
  type Query {
    getFlag: Boolean!
  }

  type Mutation {
    toggleFlag: Boolean!
  }
  `,
  resolvers: {
    Query: {
      getFlag: () => flag
    },
    Mutation: {
      toggleFlag: () => {
        flag = !flag
        return flag
      }
    }
  }
})
```

## With state

```graphql
type State {
  flag: Boolean! @bqdefault(bool: false)
}

type Query {
  getFlag: Boolean!
  @bqstate(get: "State.flag")
}

type Mutation {
  toggleFlag: Boolean!
  @bqstate(toggle: "State.flag")
}

```

```ts
import { connect, state } from 'browserql'

const plugins = [
  state()
]

const client = connect({ schema, plugins })
```

## With fetch

You can plug your queries and mutations to end-points that will be HTTP fetched

```graphql
type Todo {
  id:     ID !
  title:  String!
}

type Query {
  getTodos: [Todo!]!
  @bqfetch(get: "/todos")
}

type Mutation {
  addTodo(title: String): Todo
  @bqfetch(post: "/todos")
}
```

```ts
import { connect, rest } from 'browserql'

const client = connect({
  schema,
  plugins: [
    rest({
      base: 'http://example.com',
      json: true
    })
  ]
})
```