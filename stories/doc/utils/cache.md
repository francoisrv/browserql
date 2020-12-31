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
import cacheql from '@browserql/cache'
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

```section-h3
utils/cache/get
```

```section-h3
utils/cache/set
```

```section-h3
utils/cache/increment
```

```section-h3
utils/cache/multiply
```

```section-h3
utils/cache/toggle
```
