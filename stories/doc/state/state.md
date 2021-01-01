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
const state = stateql(client, cache, schema)
await client.query(state.get('State.counter'))
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
