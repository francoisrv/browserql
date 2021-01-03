Define your queries in your schema:

```graphql
type User {
  id: ID!
  email: String!
  isVerified: Boolean!
}

type Query {
  getUser(userID: ID!, isVerified: Boolean = false): User
}
```

Then generate executable queries from the schema:

```javascript
import { makeExecutableQuery } from '@browserql/executable'

makeExecutableQuery(schema, 'getUser')
```

Which will return in the following `GraphQL` document:

```snapshot
Operations.BuildQueryExample
```

## Print query

You can return a string instead:

```javascript
import { printExecutableQuery } from '@browserql/executable'

printExecutableQuery(schema, 'getUser')
```

```text
query Query($userID: ID!, $isVerified: Boolean) {
  getUser(userID: $userID, isVerified: $isVerified) {
    __typename
    id
    email
    isVerified
  }
}
```

## Use multiple queries

Sometimes you want to create a compound query.

Take these queries for example:

```graphql
type Query {
  getUserById(id: ID!): User!
  getUserTags(userId: ID!): [Tag]!
  getUserBadges(userId: ID!): [Badge]!
}
```

You could group them like this

```javascript
import { makeExecutableQuery } from '@browserql/executable'

makeExecutableQuery(
  schema,
  // define your variables
  { userId: 'ID!' },
  // Then put a list of queries to include by name
  'getUserTags',
  'getUserBadges',
  // You can assign a query field to a variable like this:
  ('getUserById', { id: 'userId' })
)
```

```snapshot
Operations.BuildCompoundQueryExample
```
