Get executable operation's selections

```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    email
  }
}
```

```javascript
import { getExecutableQuery, getSelections } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getExecutableQuery('GetUser'), getSelections)
```
