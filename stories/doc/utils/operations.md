# Operation builder

Build a `GraphQL` executable query or mutation from a definition schema.

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

type Mutation {
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

## Coumpound queries

Sometimes you want to create a compound query. For this use `buildCompoundQuery`.

Take these queries for example:

```graphql
type Query {
  getUserById(id: ID!): User!
  getUserTags(userId: ID!): [Tag]!
  getUserBadges(userId: ID!): [Badge]!
}
```

Let's say we want to create a compound query like this one:

```graphql
query GetUser($userId: ID!) {
  getUserById(id: $userId) {
    id
    email
  }

  getUserTags(userId: $userId) {
    id
    title
  }

  getUserBadges(userId: $userId) {
    id
    title
  }
}
```

In this case you would do:

```javascript
import { buildCompoundQuery } from '@browserql/operations'

buildCompoundQuery(
  schema,
  { userId: 'ID!' },
  ['getUserById', { id: 'userId' }],
  'getUserTags',
  'getUserBadges'
)
```

```snapshot
Operations.BuildCompoundQueryExample
```

## Build operation

Bothe `buildQuery` and `buildMutation` are actually built on top of the `buildOperation` function

````graphql

```javascript
import { buildOperation } from '@browserql/operations'

buildOperation(
  schema,
  { userId: 'ID!' },
  ['getUserById', { id: 'userId' }],
  'getUserTags',
  'getUserBadges'
)
````

## Accessories

### `buildOperationString`

Returns a string with an operation in it

```javascript
import { buildOperationString } from '@browserql/operations'

buildOperationString(schema, 'Query.getUser')
```

```graphql
($userID: ID!, $isVerified: Boolean = false) {
  getUser(userID: $userID, isVerified: $isVerified) {
    __typename
    id
    email
    isVerified
  }
}
```

```snapshot
Operations.BuildOperationString
```
