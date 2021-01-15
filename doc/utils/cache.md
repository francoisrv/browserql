# cacheql

```snapshot
Cache.GetExample
```

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "cache"
  }
}
```

Apollo cache accessor utility

## Usage

```javascript
import cacheql from '@browserql/cache'
import connect from '@browserql/connect'
import gql from 'graphql-tag'

const { cache, schema } = connect(
  gql'type Query { getCounter: Int! @default(value: 100) }'
)

const cached = cacheql(cache, schema)
const GET_COUNTER = gql`{ getCounter }`

cached.get(GET_COUNTER) // 100

cached.set(GET_COUNTER, 0)

cached.get(GET_COUNTER) // 0
```

## API

```section-h3
utils/cache/filter
```

```section-h3
utils/cache/get
```

```section-h3
utils/cache/increment
```

```section-h3
utils/cache/map
```

```section-h3
utils/cache/multiply
```

```section-h3
utils/cache/pop
```

```section-h3
utils/cache/pull
```

```section-h3
utils/cache/push
```

```section-h3
utils/cache/set
```

```section-h3
utils/cache/shift
```

```section-h3
utils/cache/toggle
```
