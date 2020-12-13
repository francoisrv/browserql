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

await client.query(getUser({ userID: 1234 }))
```
