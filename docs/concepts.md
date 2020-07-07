# Concepts

**browserql is not a graphql client to a graphql server**

Instead, it is its own client/server all happening in the browser.

## GraphQL

Advantages:

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

## Cache

[apollo cache](https://www.apollographql.com/docs/react/caching/cache-interaction/) is an essential piece in our architecture.

`browserql` queries are firstly thought to access the cache. This is why queries in `browserql` are always synchronous because they are done against the cache. In this schema, mutations are meant to update the cache and can be asynchronous. The cache is truly the single source of truth.

Note that you could use asynchronous query resolvers (view below)

### Empty cache

In this system, we can sometimes query a cache entry that does not exist yet.

If this is the case, the cache query will return null (instead of throwing an error like in apollo-cache)

In this schema

```graphql
type Query {
  getCounter: Int
}
```

when I do `client.query('getCounter')` to an empty cache, it will yield `null`.

Of course that would be a problem if we have specified a non-nullable type -- returning null then will be rejected by graphql.

That's why the cache will provide default values. Let's say you change your schema to:

```graphql
type Query {
  getCounter: Int!
}
```

Now if you do `client.query('getCounter')` against an empty cache, `0` will be yielded.

These are the default values

```graphql
String = ""
Int = 0
Float = 0
ID = ""
[Array] = []
```

Note that this does not work with types, ie `getTodo: Todo!`

### Default values

You can also specify your own default fallback value:

```graphql
type Query {
  getCounter: Int @default(value: 100)
}
```

## Query

## Resolvers

## Fragments

`browserql` creates a fragment for each of your queries.

So for the following user schema:

```graphql
type Todo {
  name: String
}

type Query {
  getTodos: [Todo]
}
```

`browserql` will automatically add this fragment to your schema:

```graphql
fragment browserqlFragment_Todo on Todo {
  name
}
```

So when you call the query:

```js
const todos = client.query('getTodos')
```

the `browserqlFragment_Todo` fragment will be used for data structure

You can use your own fragments:

```graphql
type Player {
  name: String!
  password: String!
  secretAnswer: String!
}

type Query {
  getPlayerByName(name: String!): Player
}

fragment SanitizedPlayer on Player {
  name
}
```

Then this will return:

```js
await client.query('getPlayerByName', { name: 'user123' })
{
  name: 'user123',
  password: '1234',
  secretAnswer: 'Medor'
}

await client.query('getPlayerByName', { name: 'user123' }, { fragment: 'SanitizedPlayer' })
{
  name: 'user123'
}
```

You could also use an inline fragment:

```js

await client.query(
  'getPlayerByName',
  { name: 'user123' },
  { fragment: gql`
  fragment SanitizedPlayer on Player {
    name
  }


  ` }
)
{
  name: 'user123'
}
```

