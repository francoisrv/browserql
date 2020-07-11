# Default

## Default in a type

```graphql
type Foo {
  score: Int! @default(value: 100)
}
```

## Default in a query or a mutation

```graphql
type Query {
  getInteger: Int! @default(value: 100)
}
```