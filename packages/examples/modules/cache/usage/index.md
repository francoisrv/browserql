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

## Demo

{{ render example.tsx }}
