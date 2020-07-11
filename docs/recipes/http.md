# HTTP

```graphql
type Mutation {
  getFoos: [Foo] @get(url: "http://example.com")
}
```