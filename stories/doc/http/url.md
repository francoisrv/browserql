The URL of the endpoint

```graphql
@http(url: "http://example.com")
```

Note that you can use parameter syntax to insert a variable's value into the query

```graphql
type Query {
  getTodos(protocol: String = "https", completed: Boolean!): [Todo]!
    @http(
      url: ":protocol://jsonplaceholder.typicode.com/todos/?completed=:completed"
    )
}
```

```javascript
await client.query(Query.getTodos({ completed: true }))
```
