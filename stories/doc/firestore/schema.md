# Schema

## Directives

### @firestore

Use this directive to a type in order to mark it as a firestore collection

```graphql
type Todo @firestore {
  name: String!
}
```

We will now look for a collection in Firestore called `Todo`.

You can specify another name using the `collection: String` argument

```graphql
type Todo @firestore(collection: "todos") {
  name: String!
}
```

You can use the introspection utility `showCollections` to view collections in a schema:

```javascript
import { showCollections } from '@browserql/firestore'
import gql from 'graphql-tag'

const collections = showCollections(gql`
  type A @firestore {
    name: String!
  }

  type B @firestore(collection: "collection-b") {
    name: String!
  }
`)
```

```snapshot
FirestoreSchemaShowCollections
```

You need to pass `showCollections` a `GraphQL` schema as first argument.

This schema can be a document node (like hereinabove), or a string:

```javascript
const collections = showCollections(`
  type A @firestore {
    name: String!
  }

  type B @firestore(collection: "collection-b") {
    name: String!
  }
`)

expect(collections).toEqual({
  A: 'A',
  B: 'collection-b',
})
```

### Collection naming

By default, the name of the GraphQL type is used as the collection name.

As seen above, you can specify a different name via the `collection` attribute.

You can also specify a naming strategy to be applied to all types, by specifying via the `namingStrategy` property;

```javascript
const schema = gql`
  type User @firestore {
    name: String!
  }

  type Team @firestore {
    name: String!
  }
`

// A very shallow function to pluralize type names
const pluralize = (name) => name.toLowerCase().concat('s')

const collections = showCollections(schema, {
  namingStrategy: pluralize,
})

expect(collections).toEqual({
  User: 'users',
  Team: 'teams',
})
```

## Scalars

We need the JSON scalar, you can add it like this:

With Apo

## Generated schema

This is the schema that we generate:

```graphql
directive @firestore(collection: String) on OBJECT

directive @firestore_ref on FIELD_DEFINITION

enum FirestoreWhereOperator {
  equals
  isGreaterThan
  isGreaterThanOrEqualTo
  isIn
  isLesserThan
  isLesserThanOrEqualTo
}

input FirestoreFilters {
  asc: Boolean
  limit: Int
  orderBy: String
  page: Int
}

input FirestoreWhere {
  field: String!
  operator: FirestoreWhereOperator!
  value: JSON!
}

input FirestoreTransformer {
  field: String!
  value: JSON
}

type FirestoreMutationResponse {
  ok: Boolean!
}
```
