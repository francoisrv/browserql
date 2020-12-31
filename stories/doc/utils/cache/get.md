Get the value of a cached query

```graphql
type Query {
  getCounter: Int!
}
```

```snapshot
Cache.GetNonNullEmpty
```

#### Get empty cache

If the cache is empty for that query, you can choose which substitute value to be presented with:

##### Null values

If the query accepts null response, a `null` value will be returned (contrary to `apolloClient` which throws on empty entry)

```graphql
type Query {
  getCounter: Int
}
```

```snapshot
Cache.GetNullEmpty
```

##### Non-null values

If the query does not accept null response, an `undefined` value will be returned (contrary to `apolloClient` which throws on empty entry)

```graphql
type Query {
  getCounter: Int!
}
```

```snapshot
Cache.GetNonNullEmpty
```

#### Set initial values

You could also set initial values.

```graphql
type Query {
  getCounter: Int! @default(value: 100)
}
```

```snapshot
Cache.GetDefault
```

**Note** You need to also inject the `@default` directive into the schema, such as:

```graphql
directive @default(value: JSON!) on FIELD_DEFINITION
```
