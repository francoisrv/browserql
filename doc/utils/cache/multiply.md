If the query value is a number, you can use this to multiply or divide this value

```graphql
type Query {
  getCounter: Int! @default(value: 10)
}
```

```javascript
cache.get(query) // 10

cache.multiply(query, 10)
cache.get(query) // 100

cache.multiply(query, 0.5)
cache.get(query) // 50
```
