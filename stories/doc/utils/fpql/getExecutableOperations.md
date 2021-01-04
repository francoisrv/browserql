Get executable operations

```javascript
import { getExecutableOperations } from '@browserql/fpql'
```

```graphql
query {
  query1
}

mutation Mutation1 {
  mutation1
}

query Query2 {
  query2
}
```

```javascript
getExecutableOperations(schema)
```

```snapshot
FPQL.GetExecutableOperations
```
