Use this to set the value of a cache

```graphql
type Query {
  getCounter: Int
}
```

```snapshot
Cache.SetExampleGet
```

```javascript
cached.set(GET_COUNTER, 100)
```

```snapshot
Cache.SetExampleSet
```

#### Set with a function

You can also use a function which first argument is the current value of the cache

```javascript
cache.get(query) // 50

cache.set(query, (value) => (value < 100 ? 0 : value))

cache.get(query) // 0
```

### Set with variables

```graphql
type Query {
  getCounter(user: ID!): Int
}
```

```javascript
cache.set(query, { user: 1234 }, 100)
```

Note that if a query requires variables and you on your part do not specify them, then it will throw an error:

```javascript
cache.set(query, 100) // Error: Missing required variable user
```
