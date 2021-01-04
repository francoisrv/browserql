Get executable operation by name

```javascript
import { getExecutableOperation } from '@browserql/fpql'
```

```graphql
query Query1 {
  query1
}

query Query2 {
  query2
}
```

```javascript
getExecutableOperation('Query2')(schema)
```

```snapshot
FPQL.GetExecutableOperation
```
