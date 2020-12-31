If the query value is a `boolean`, you can use this to easily switch that value from `true` to `false`

```graphql
type Query {
  isLoggedIn: Boolean! @default(value: false)
}
```

```javascript
cache.get(query) // false
cache.toggle(query)
cache.get(query) // true
```
