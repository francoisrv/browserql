# BrowserqlQuery

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "react"
  }
}
```

A React component that wraps the apollo hooks. They do the same thing as hooks -- you would use them for cosmetic preferences only.

```graphql
type Query {
  sayHello(to: String!): String!
}
```

## Side-to-side comparison with apollo hooks

### With apollo hooks

```jsx
import { useQuery } from '@apollo/client'

function SayHello({ to }) {
  const { data, loading, error } = useQuery(SAY_HELLO, {
    variables: {
      to: 'everybody',
    },
  })

  if (error) return <div>{error.message}</div>

  if (loading) return <div>Loading...</div>

  return <p>{data.sayHello}</p>
}
```

### With components

```jsx
import { UseQuery } from '@browserql/react'

function SayHello({ to }) {
  return (
    <UseQuery
      query={SAY_HELLO}
      variables={{ to: 'everybody' }}
      renderError={({ error }) => <div>{error.message}</div>}
      renderLoading={<div>Loading...</div>}
    >
      {(response) => <p>{response}</p>}
    </UseQuery>
  )
}
```

```snapshot
React.QueryExample
```

## Usage

Just fill it with a `GraphQL` query and a renderer:

```graphql
type Query {
  getUser: User!
}

type User {
  id: ID!
  name: String!
}
```

```javascript
function User {
  return (
    <WithQuery query={GET_USER}>
      {user => <h4>{user.name}</h4>}
    </WithQuery>
  )
}
```

## Variables

If the query has variables, enter them via the `variables` prop:

```graphql
type Query {
  getUser(id: ID!): User!
}

type User {
  id: ID!
  name: String!
}
```

```javascript
function User {
  return (
    <WithQuery query={GET_USER} variables={{ id: 1234 }}>
      {user => <h4>{user.name}</h4>}
    </WithQuery>
  )
}
```

## Rendering loading states

By default, a loading state returns an empty `React` fragment.

You can specify a loading view via the `renderLoading` prop:

```javascript
function User {
  return (
    <WithQuery query={GET_USER} renderLoading={<div>Loading..</div>}>
      {user => <h4>{user.name}</h4>}
    </WithQuery>
  )
}
```

## Handling errors

By default, an error state returns an empty `React` fragment.

You can specify an error view via the `renderError` prop which accepts a function that returns a `React Element`:

```javascript
function User {
  return (
    <WithQuery query={GET_USER} renderError={({ error }) => <div>{error.message}</div>}>
      {user => <h4>{user.name}</h4>}
    </WithQuery>
  )
}
```

## Lasy loading

By default, when requiring a query, the latter gets executed right away.

You can choose lazy mode instead so you can call the query whenever you want.

```javascript
function User {
  return (
    <WithQuery lazy query={GET_USER}>
      {() => <div />}
    </WithQuery>
  )
}
```

## Renderer

### Data argument

The first argument the renderer receives is the data of the query.

Unlike with regular `GraphQL`, we unwrap data:

```javascript
// with Apollo:
const user = data.getUser

// with components:
const user = data
```

## Multiple queries

The component is designed to handle only query. That's why it unwraps data since the query name is redundant when only one query.

If you want to use multiple queries, the data then is not unwrapped

```graphql
type Query {
  getUserById(id: ID!): User!
  getUserTags(userId: ID!): [Tag]!
  getUserBadges(userId: ID!): [Badge]!
}
```

```graphql
query GetUser($userId: ID!) {
  getUserById(id: $userId) {
    ...UserFragment
  }

  getUserTags(userId: $userId) {
    ...TagFragment
  }

  getUserBadges(userId: $userId) {
    ...Badge
  }
}
```

```javascript
import { WithQueries } from '@browserql/react'

function GetUser({ userId }) {
  return (
    <WithQueries query={GET_USER} variables={{ userId }}>
      {({ getUserById: user, getUserTags: tags, getUserBadges: badges }) => (
        <div>
          <h1>Hello, {user.name}!</h1>
          <p>
            You have {tags.length} tags and {badges.length} badges.
          </p>
        </div>
      )}
    </WithQueries>
  )
}
```
