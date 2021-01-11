Get node's argument by name

```define
@schema
```

```graphql
type A @foo(bar: 24) {
  id: ID!
}
```

```define
@main
```

```javascript
import { getArgument, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getType('A'), getDirective('foo'), getArgument('bar'))
```

```run
@main
```

```snapshot
FPQL.GetDirectiveArgument
```
