Group extensions together

```javascript
import { group } from '@browserql/fpql'
```

```graphql
type Query {
  a: Int
}

extend type Query {
  b: Int
}
```

```javascript
group(schema)
```

```snapshot
FPQL.Group
```
