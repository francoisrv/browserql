## Usage

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
Executable.MakeExecutableQuery
```

## Query not found

If a query is not found, it will **throw an error**:

```graphql
type Query {
  foo: String
}
```

```javascript
makeExecutableQuery(schema, 'bar')
```

```snapshot
Executable.MakeExecutableQueryNotFound
```

## Print query

You can return a string instead:

```javascript
import { printExecutableQuery } from '@browserql/executable'

printExecutableQuery(schema, 'getUser')
```

```snapshot
Executable.PrintExecutableQuery
```

Note that `makeExecutableQuery` and `printExecutableQuery` have the same signature -- the later returns a string while the former returns that string parsed by [graphql-tag](https://github.com/apollographql/graphql-tag).

## Variables

By default, it will pick all the variables of the picked queries and put them inside the query variables

```graphql
type Query {
  sayHello(to: String!, upperCase: Boolean = false): String
}
```

```javascript
makeExecutableSchema(schema, 'sayHello')
```

```snapshot
Executable.MakeExecutableQueryVariables
```

### Variables with multiple queries

```graphql
type Query {
  sayHello(to: String!, upperCase: Boolean = false): String
  divide(number: Int!, by: Int!): Float!
}
```

```javascript
makeExecutableSchema(schema, 'sayHello', 'divide')
```

```snapshot
Executable.MakeExecutableQueryVariablesMultipleQueries
```

When creating a query with multiple queries in it, it will throw an error if two arguments have the same name but not the same kind:

```graphql
type Query {
  ceil(number: Float!): Int!
  square(number: Int!): Float!
}
```

```javascript
makeExecutableSchema(schema, 'ceil', 'square')
```

```snapshot
Executable.MakeExecutableQueryDoNotMatch
```

## Signature

You can pass as many arguments as you want, in any order -- as long as the argument is one of:

### A document node

This is the schema to use to generate executable queries from.

If more than one is provided, they are merged together using [the merge strategy from the `fpql` library](/23).

At least one must be present **otherwise it will throw an error**.

```javascript
makeExecutableQuery(
  graphql`
    type Query {
      hello
    }
  `,

  graphql`
    type Query {
      goodbye
    }
  `,

  'hello',
  'goodbye'
)
```

```graphql
query Query {
  hello
  goodbye
}
```

### A query identifier

This is the way to tell which schema query to use to generate from.

It can be a `string` or an object `Record<string, string>`.

At least one must be present **otherwise it will throw an error**.

If a query identifier has no match in the schema **it will throw an error**.

#### Query identifier as a string

Just pass along the name of the query to be generated. You can pass as many as you want.

```graphql
type Query {
  divide(number: Int!): Int!
  multiply(number: Int!): Int!
  subtract(number: Int!): Int!
  sum(number: Int!): Int!
}
```

```javascript
makeEexcutableQuery(schema, 'divide', 'multiply', 'sum', 'subtract')
```

```graphql
query Query($number: Int!) {
  divide(number: $number)
  multiply(number: $number)
  subtract(number: $number)
  sum(number: $number)
}
```

#### Query identifier as on object

You can pass an object. The keys will be the query names and their values, the query fields.

```graphql
type Query {
  divide(number: Int!): Int!
  multiply(number: Int!): Int!
  subtract(number: Int!): Int!
  sum(integer: Int!): Int!
}
```

```javascript
makeEexcutableQuery(schema, 'divide', 'multiply', 'sum', 'subtract')
```

```graphql
query Query($number: Int!) {
  divide(number: $number)
  multiply(number: $number)
  subtract(number: $number)
  sum(number: $number)
}
```

## Use multiple queries

Sometimes you want to create a compound query.

Take these queries for example:

```graphql
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
  { getUserById: { id: '$userId' } }
)
```

```snapshot
Executable.MakeExecutableQueries
```
