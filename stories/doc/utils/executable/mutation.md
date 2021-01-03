```graphql
type Mutation {
  addUser(email: String!): User
}

type User {
  id: ID!
  email: String!
}
```

```javascript
import { buildMutation } from '@browserql/operations'

buildMutation(schema, 'addUser')
```

```snapshot
Operations.BuildMutationExample
```
