Get all types from a schema

```javascript
import { getTypes } from '@browserql/fpql'
```

```graphql
type A {
  id: ID
}

type B {
  id: ID
}
```

```javascript
getTypes(schema).map(getName)
```

```snapshot
FPQL.GetTypes
```
