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
```

```snapshot
FirestoreSchemaShowCollectionsString
```

### Collection naming

By default, the name of the GraphQL type is used as the collection name.

As seen above, you can specify a different name via the `collection` attribute.

You can also specify a naming strategy to be applied to all types, by specifying via the `namingStrategy` property;

```graphql
type User @firestore {
  name: String!
}

type Team @firestore {
  name: String!
}
```

```javascript
showCollections(schema, {
  namingStrategy: (name) => name.toLowerCase().concat('s'),
})
```

```snapshot
FirestorePluralize
```

## Scalars

We need the JSON scalar, you can add it using [graphql-scalars](https://github.com/Urigo/graphql-scalars) or with [@browserql/scalars](/utils/scalars)

## Firestore schema

This is the schema used by firestoreql:

```snapshot
FirestoreGeneratedSchema
```

## Queries

We generate queries based on the types marked as collections.

## count

Used to perform `firestore` count documents

```snapshot
FirestoreSchemaQueriesCount
```

## getMany

Used to perform `firestore` get queries to return a batch of documents

```snapshot
FirestoreSchemaQueriesGetMany
```

## getOne

Used to perform `firestore` get queries to return one document

```snapshot
FirestoreSchemaQueriesGetOne
```
