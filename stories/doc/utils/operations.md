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

buildQuery(schema, 'getUser')
```

```snapshot
Operations.BuildQueryExample
```

## Mutations

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
import { buildMutation } from '@browserql/operations'

buildMutation(schema, 'addUser')
```

```snapshot
Operations.BuildMutationExample
```
