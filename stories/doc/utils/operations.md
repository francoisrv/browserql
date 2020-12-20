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

## Coumpound queries

Sometimes you want to create a compound query. For this use `buildQueries`.

Take these queries for example:

```graphql
type Query {
  getUserById(id: ID!): User!
  getUserTags(userId: ID!): [Tag]!
  getUserBadges(userId: ID!): [Badge]!
}
```

Let's say we want to create a coompound query like this one:

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

In this case you would do:

```javascript
import { buildQueries } from '@browserql/operations'

buildQueries(
  schema,
  {
    variables: {
      userId: 'ID!',
    },
  },
  [
    {
      getUserById: {
        variables: {
          id: 'userId',
        },
      },
    },
    {
      getUserBadges: {
        variables: {
          userId: 'userId',
        },
      },
    },
    {
      getUserById: {
        variables: {
          id: 'userId',
        },
      },
    },
  ]
)
```
