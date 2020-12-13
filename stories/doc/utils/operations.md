# Operation builder

Build a `GraphQL` query or mutation given a schema

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
import { buildQuery } from '@browserql/operations'

await client.query({
  query: buildQuery(schema, 'getUser'),
  variables: {
    userID: 1234,
  },
})
```
