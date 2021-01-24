Get a value node

```graphql
type Query {
  getUser: User! @variant(admin: true)
}
```

```javascript
import { getValue, getDirective, getArgument, getQuery } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(
  getQuery('getUser'),
  getDirective('variant'),
  getArgument('admin'),
  getValue
)
```

```snapshot
FPQL.GetValue
```

## Use cases

### Objects

```graphql
type Query {
  getUser: User! @variant(admin: { level: 2 })
}
```

```snapshot
FPQL.GetObjectValue
```
