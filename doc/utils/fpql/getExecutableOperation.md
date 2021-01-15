Get executable operation by name

```javascript
import { getExecutableOperation } from '@browserql/fpql'
```

```graphql
query Query1($a: Int) {
  query1(a: $a)
}

query Query2($b: Int) {
  query2(b: $b) {
    id
    name
  }
}
```

```javascript
getExecutableOperation('Query2')(schema)
```

```snapshot
FPQL.GetExecutableOperation
```
