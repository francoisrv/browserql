Get node's argument by name

```javascript
import { getArgument } from '@browserql/fpql'
```

```graphql
type A @foo(bar: 24) {
  id: ID!
}
```

```javascript
const type = getType('A')(schema)
const directive = getDirective('foo')(type)

getArgument('bar')(directive)

fp(schema)(getType('A'), getDirective('foo'), getArgument('bar'), getValue)
```

```snapshot
FPQL.GetDirectiveArgument
```
