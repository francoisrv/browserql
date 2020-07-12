browserql
===

Use graphql in the browser as a state manager.

```graphql
type Todo @model {
  name: String! @unique
  done: Boolean! @default(value: false)
}

type State @state {
  counter: Int! @default(value: 100)
  isLoggedIn: Boolean! @default(value: false)
}
```

```ts
import { connect, state } from 'browserql'
import firestore from 'browserql-plugin-firestore'

connect({
  schema,
  plugins: [
    state(),
    firestore(),
  ]
})

const schema = `
type Todo {
  id:       ID!
  title:    String!
  done:     Boolean!
}

input TodoFilters {
  title:    String
  done:     Boolean
}

input Paging {
  page:     Int @default(0)
  perPage:  Int @defaul(25)
}

type Query {
  getTodos(

    where:    TodoFilter
    paging:   Paging
  
  ):        [Todo]  @bqstate(get: "Todo")
                    @bqfetch(get: "/todos")
}

type Mutation {
  addToDo(

    title: String!
    done: Boolean = false
  
  ):        Todo    @bqfetch(post: "/todos")
}
`

// Create a in-browser Graphql server and return a client to it
const client = connect({ schema, resolvers })
```

```ts
import { connect } from '@browserql/core'

const schema = `
type Query {
  hello(person: String!): String!
}
`
const resolvers = {
  Query: {
    hello: ({ person }) => `Hello ${person}`
  }
}

// Create a in-browser Graphql server and return a client to it
const client = connect({ schema, resolvers })
```

## With transactions

```ts
client.transactions.getQuery('hello')
```

## State management

```graphql
type State {
  flag: Boolean! @bqdefault(bool: false)
}

type Query {
  getFlag: Boolean! @bqstate(get: "State.flag")
}

type Mutation {
  toggleFlag: Boolean! @bqstate(toggle: "State.flag")
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

```ts
import { connect, schema } from 'browserql'

const client = connect({
  plugins: [
    schema({
      transactions: [
        `query getPosts(blogId: ID!) {
          ...PostFragment  
        }`
      ]
    })
  ]
})
```