```javascript
import { build } from '@browserql/firestore'

build(
  firestore(),
  gql`
    type Todo @firestore {
      name: String!
    }
  `
)
```

```typescript
build(
  db: firestore.Firestore.Database
  schema: string | DocumentNode
): {
  schema: DocumentNode
  queries: any
  mutations: any
}
```
