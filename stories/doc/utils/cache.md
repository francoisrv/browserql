# cacheql

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "cache"
  }
}
```

Apollo cache accessor utility

```javascript
import { cacheql } from '@browserql/cache'
import resolve from '@browserql/resolved'

const schema = 'type Query { getCounter: Int! }'

const cache = cacheql(apolloClient.cache)

const resolved = resolve(schema)

const query = resolved.Query.getCounter()

cache.get(query) // undefined
cache.set(query, 0)
cache.get(query) // 0
cache.increment(query)
cache.get(query) // 1
```

## API

### Get

Get the value of a cached query

```graphql
type Query {
  getCounter: Int!
}
```

```javascript
cache.get(query) // 0
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

```javascript
cache.get(query) // null
```

##### Non-null values

If the query does not accept null response, an `undefined` value will be returned (contrary to `apolloClient` which throws on empty entry)

```graphql
type Query {
  getCounter: Int!
}
```

```javascript
cache.get(query) // undefined
```

#### Set initial values

You could also set initial values.

##### Set initial values in function

```graphql
type Query {
  getCounter: Int!
}
```

```javascript
const cache = cacheql(apolloClient.cache, {
  initialValues: [
    {
      query: Query,
      value: 100,
    },
  ],
})

cache.get(query) // 100
```

##### Set default values based on scalars

VIEW `@browserql/auto-default`

You could also choose to create default values based on their scalars

```graphql
type Query {
  getCounter: Int!
  isLoggedIn: Boolean!
  getCredits: Float!
  getTitle: String!
}
```

```javascript
const cache = cacheql(apolloClient.cache, { auto: true })

cache.get(Query.getCounter()) // 0
cache.get(Query.isLoggedIn()) // false
cache.get(Query.getCredits()) // 0.00
cache.get(Query.getTitle()) // ""
```

### Set

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

### Increment

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

### Multiply

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

### Toggle

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
