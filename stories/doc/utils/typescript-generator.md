# Typescript generator

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "typescript-generator"
  }
}
```

Generate typescript as a string from any `GraphQLNode` node

## Usage

Let's take a simple `GraphQL` schema:

```graphql
type User {
  name: String!
  age: Int
}
```

```javascript
import gents from '@browserql/typescript-generator'

gents(schema)
```

Which will return the following **string**:

```snapshot
TypescriptGenerator.Usage
```

## Scalar conversions

| GraphQL   | TypeScript         |
| --------- | ------------------ |
| `Boolean` | `boolean`          |
| `Float`   | `number`           |
| `ID`      | `string \| number` |
| `Int`     | `number`           |
| `String`  | `string`           |

```graphql
type Foo {
  a: Boolean
  b: Float
  c: ID
  d: Int
  e: String
}
```

```snapshot
TypescriptGenerator.Kinds
```

## Nullable values

If a value can be null, the `?` symbol will be used along with `null`:

```graphql
type Foo {
  id: ID
}
```

```snapshot
TypescriptGenerator.NonNull
```

## Lists

If a value is an array, the `[]` symbol will be used:

```graphql
type Foo {
  ids: [ID]!
}
```

```snapshot
TypescriptGenerator.Lists
```

## Functions

If a `GraphQL` field is using arguments, it will be converted into a function

```graphql
type Foo {
  foo(bar: String): Boolean
}
```

```snapshot
TypescriptGenerator.Functions
```

## Extended types

```graphql
type User {
  name: String!
}

extend type User {
  email: String!
}
```

```snapshot
TypescriptGenerator.ExtendedTypes
```

## Enumerations

```graphql
enum HttpMethod {
  GET
  POST
  PUT
  DELETE
}
```

```snapshot
TypescriptGenerator.Enums
```
