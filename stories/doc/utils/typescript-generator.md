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

## Built-in scalar conversions

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

## Handle missing entities

If it is not a built-in scalar, it will be left unchanged, assuming it is present in the schema

```graphql
type User {
  subscription: Subscription!
}
```

```snapshot
TypescriptGenerator.Untouched
```

## Nullable values

You can choose which strategy to use to represent values that might be `null`.

You can sppecify the strategy like this:

```javascript
gents(schema, { null: NULL_STRATEGY })
```

You can use more than one strategy

```javascript
gents(schema, { null: ['missng', 'null'] })
```

In `Typescript`, use the `NULL_STRATEGY` `enum`:

```javascript
import gents from '@browserql/typescript-generator'
import type { NULL_STRATEGY } from '@browserql/typescript-generator'

gents(schema, { null: NULL_STRATEGY.null })
```

### Strategies

These are the strategies:

- **null**
- **undefined**
- **missing**

Imagine the following `GraphQL` schema where `bar` is `nullable` in `GraphQL`

```graphql
type Foo {
  bar: String
}
```

| code                 | `{ null: 'null' }`                                    | `{ null: 'undefined' }`                                    | `{ null: 'missing' }`                                                |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| `{ bar: 'a' }`       | **OK**                                                | **OK**                                                     | **OK**                                                               |
| `{}`                 | **ERROR** Missing field `bar`                         | **ERROR** Missing field `bar`                              | **OK**                                                               |
| `{ bar: null }`      | **OK**                                                | **ERROR** `bar` should be either a `string` or `undefined` | **ERROR** `bar` should be either a `string`, `undefined`, or missing |
| `{ bar: undefined }` | **ERROR** `bar` should be either a `string` or `null` | **OK**                                                     | **OK**                                                               |

### The `null` strategy

The defaut strategy is `null` -- which is the default in GraphQL.

It means all fields must be present, even the optional ones, who need to be set to `null` if their value is missing

```graphql
type Foo {
  bar: String
}
```

```javascript
gents(schema, { null: 'null' })
// Since this is the default version, this is the same as:
gents(schema)
```

```snapshot
TypescriptGenerator.NullableWithNull
```

### The `undefined` strategy

You could also set `null` as `undefined`. This means optional fields without value must be undefined.

```javascript
gents(schema, { null: 'undefined' })
```

```snapshot
TypescriptGenerator.NullableWithUndefined
```

### The `missing` strategy

This means the field does not have to be present if it is not required.

```javascript
gents(schema, { null: 'missing' })
```

```snapshot
TypescriptGenerator.NullableWithMissing
```

### Using more than one strategy

This means the field does not have to be present if it is not required.

```javascript
gents(schema, { null: ['missing', 'null'] })
```

```snapshot
TypescriptGenerator.NullableWithMixed
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

## Methods

If a `GraphQL` field is using arguments, it will be converted into a method

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
