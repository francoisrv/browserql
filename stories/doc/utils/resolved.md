# Resolved

Create accessor to an executable `GraphQL` schema

```javascript
const { Query, composeQuery } = resolve(finalSchema)

await client.query(Query.getTodo({ id: 2 }))

await client.query(
  composeQuery(
    { userId: 2 },
    Query.getUserById.renameVariables({ id: 'userId' }),
    Query.getUserPreferences,
    Query.getUserBadges
  )
)
```

```graphql
type User {
  id: ID!
  email: String!
}

extend type Query {
  getUser(userID: ID!): User
}
```

```javascript
import resolve from '@browserql/resolved'

const {
  Query: { getUser },
} = resolve(schema)

getUser({ userID: 1234 })
```

```snapshot
Resolved.Example
```

## Mutation

```graphql
type User {
  id: ID!
  email: String!
}

extend type Mutation {
  addUser(email: String!): User
}
```

```javascript
import resolve from '@browserql/resolved'

const {
  Mutation: { addUser },
} = resolve(schema)

addUser({ email: 'foo@bar.com' })
```

```snapshot
Resolved.ExampleMutation
```
