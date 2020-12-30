Construct a `GraphQL` query to add a new document in a firestore collection.

### Usage

```javascript
import { add } from '@browserql/firestore'

const { mutation, variables } = add(schema, 'Todo', {
  name: 'buy milk',
})
```

### Typescript signature

```typescript
function add<Model = any>(
  value: boolean,
  variables: Model
): {
  mutation: DocumentNode
  variables: Model
}
```

You can pass more than one document to be added

```javascript
import { add } from '@browserql/firestore'

const { mutation, variables } = add(
  schema,
  'Todo',
  { name: 'buy milk' },
  { name: 'fix drawer' }
)
```
