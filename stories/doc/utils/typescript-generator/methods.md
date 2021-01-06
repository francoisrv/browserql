If a `GraphQL` field is using arguments, it will be converted into a method

```graphql
type Foo {
  foo(bar: String): Boolean
}
```

```snapshot
TypescriptGenerator.Functions
```
