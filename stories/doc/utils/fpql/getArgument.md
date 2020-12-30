Get node's argument by name

```graphql
type A @foo(bar: 24) {
  id: ID!
}
```

```javascript
import { getArgument, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getType('A'), getDirective('foo'), getArgument('bar'))
```

```snapshot
FPQL.GetDirectiveArgument
```
