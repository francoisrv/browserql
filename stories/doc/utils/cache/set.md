Use this to set the value of a cache

```graphql
type Query {
  getCounter: Int!
}
```

```javascript
cache.get(query) // 0

cache.set(query, 100)

cache.get(query) // 100
```

#### Set with a function

You can also use a function which first argument is the current value of the cache

```javascript
cache.get(query) // 50

cache.set(query, (value) => (value < 100 ? 0 : value))

cache.get(query) // 0
```
