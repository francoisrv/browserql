Pass a schema. It has to be a GraphQL `DocumentNode`. You can use a tool like [graphql-tag](https://www.npmjs.com/package/graphql-tag) to parse a string into a `GraphQL` node -- or using a bundle loader.

```graphql
type Query {
  isMorning: Boolean
}
```

You can pass a schema alone

```javascript
connect(schema)
```

```snapshot
Client.SchemaExample
```

Or inside an object

```javascript
connect({ schema })
```

```snapshot
Client.SchemaObject
```
