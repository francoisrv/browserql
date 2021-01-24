```snapshot2
State.Example
```

```graphql
type Query {
  getCounter: Int @getState(initialValue: 100)
}
```

```graphql
query {
  getCounter
}
```

```json
{
  "getCounter": null
}
```

```graphql
mutation {
  _set(query: getCounter, to: 100)
}
```

```graphql
query {
  getCounter
}
```

```json
{
  "getCounter": 100
}
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