# Resolved

Create accessor to an executable `GraphQL` schema

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
