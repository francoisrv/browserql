Tell a query to sort results by ascending order.
Expect `true` or `false` as argument.

By default, asc is `true`

```javascript
import { asc, get } from '@browserql/firestore'

const { query, variables } = get(schema, 'Todo', asc(false))
```

```typescript
asc(value: boolean): {
  type: FirestoreqlType.getter
  name: 'asc'
  value: boolean
}
```
