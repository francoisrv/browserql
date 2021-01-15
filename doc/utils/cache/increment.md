If the query value is a number, you can use this to increment or decrement this value

```graphql
type Query {
  getCounter: Int!
}
```

```javascript
cache.get(query) // 0

cache.increment(query)
cache.get(query) // 1

cache.increment(query, 2)
cache.get(query) // 3

cache.increment(query, -3)
cache.get(query) // 0
```
