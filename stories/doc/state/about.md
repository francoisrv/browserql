# State

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "state"
  }
}
```

```graphql
type State @state {
  counter: Int!
  darkMode: Boolean!
  message: String!
}
```

```javascript
import { buildState } from '@browserql/state'

const { schema, queries, mutations, context } = buildState(schema)

await client.query(context.get('counter')) // 0
await client.mutate(context.increment('counter'))
await client.query(context.get('counter')) // 1
```
