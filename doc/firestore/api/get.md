Constructs a `GraphQL` query that can be passed to a client to be executed

```graphql
type Todo @firestore {
  name: String
}
```

```javascript
import { get } from '@browserql/firestore'

get(schema, 'Todo')
```

```snapshot
Firestore.ApiGet
```
