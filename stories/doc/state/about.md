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
import { buildState, connectState, stateql } from '@browserql/state'
import connect from '@browserql/client'
import defs from './defs.graphql'

const { client, cache, schema } = connect(defs, buildState(defs))

const state = connectState(cache, schema)

state.get('State.counter') // 0

state.set('State.counter', 1)

state.get('State.counter') // 1

// You can also use Apollo client

client.query(stateql.get('State.counter'))
client.mutate(stateql.set('State.counter', 1))
```

```snapshot
State.Example
```

## Toggle

```graphql
type State @state {
  hypeTrainInProgress: Boolean! @default(value: false)
}
```

```javascript
state.get('State.hypeTrainInProgress') // false

state.toggle('State.hypeTrainInProgress')

state.get('State.hypeTrainInProgress') // true
```
