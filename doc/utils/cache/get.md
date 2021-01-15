Get the value of a cached query

## Example

```graphql
type Query {
  getCounter: Int! @default(value: 100)
}
```

```snapshot
Cache.GetExample
```

## Query with variables

```graphql
type Query {
  getCounter(userID: ID!): Int
}
```

```snapshot
Cache.GetExampleWithVariables
```

## Get empty cache

When there is no entry in the cache for the query, the module will do its best to return a value, following this simple flow:

1. Use default value -- if present via the `@default` directive
1. If all the above failed, use `undefined` if the value is non-nullable, `null` otherwise

### Use `@default` value

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

### Fallback values

Otherwise, you can choose which substitute value to be presented with:

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
