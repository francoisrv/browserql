Get schema's scalar by name

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
getScalar('EmailAddress')(schema)
```

```snapshot2
FPQL.GetScalar
```
