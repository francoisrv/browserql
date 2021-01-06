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

`ID` is viewed as a `string` or a `number`. You can overwrite that

```javascript
gents(schema, { ID: 'string' })
```

```graphql
type User {
  id: ID!
}
```

```snapshot
TypescriptGenerator.ID
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
