Get node's argument by name.

{{ include: schema }}

You need to pass it a name, which will return you a function that you call with the target node

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
