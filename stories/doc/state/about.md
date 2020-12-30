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
  counter: Int! @default(value: 100)
}
```

```javascript
import { buildState } from '@browserql/state'

const { schema, queries, mutations, context } = buildState(schema)

await client.query(context.ql.get('State.counter')) // 0
await client.mutate(context.ql.increment('State.counter'))
await client.query(context.ql.get('State.counter')) // 1
```

```graphql
type Query {
  state__State_counter__get: Int!
}

type Mutation {
  state__State_counter__set(counter: Int!): Int!
  state__State_counter__increment(step: Int = 1): Int!
  state__State_counter__multiply(step: Int = 1): Int!
}
```

```snapshot
State.Example
```
