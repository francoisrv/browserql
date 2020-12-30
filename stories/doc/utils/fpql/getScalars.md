Get schema's scalars

```javascript
import { getScalars } from '@browserql/fpql'
```

```graphql
scalar EmailAddress

type User {
  email: EmailAddress
}
```

```javascript
getScalars(schema)
```

```snapshot
FPQL.GetScalars
```
