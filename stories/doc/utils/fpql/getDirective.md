Get node's directive by name

```javascript
import { getDirective } from '@browserql/fpql'
```

```graphql
type A @foo {
  id: ID! @foo
}
```

```javascript
const type = getType('A')(schema)
const directive = getDirective('foo')(type)
getName(directive)
```

```snapshot2
MISSING SNAPSHOT TEST
```
