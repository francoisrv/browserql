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
