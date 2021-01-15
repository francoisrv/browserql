Get argument's default value

```graphql
type Query {
  get(flag: Boolean = false): Boolean
}
```

```javascript
import { getQuery, getArgument, getDefaultValue } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getQuery('get'), getArgument('flag'), getDefaultValue)
```

```snapshot
FPQL.GetDefaultValue
```
