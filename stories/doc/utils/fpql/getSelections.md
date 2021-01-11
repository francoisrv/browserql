Get executable operation's selections

```$is
schema
```

```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    email
  }
}
```

```$is
code
```

```javascript
import { getExecutableQuery, getSelections } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getExecutableQuery('GetUser'), getSelections)
```

```$run
code
```
