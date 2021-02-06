State allows you to manage a state based on your cached queries

```graphql
type Query {
  getCounter: Int @default(value: 100)
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

```javascript
function App() {
  return (
    <State query="getCounter">
      {(getCounter) => (
        <button onClick={getCounter.increment}>{getCounter.get()}</button>
      )}
    </State>
  )
}

function App() {
  return (
    <State use="definitions">
      {(definitions) => (
        <For each={definitions}>
          {(definition) => (
            <div key={definition.id}>
              <Input
                value={definition}
                onChange={(e) =>
                  definitions.map(
                    { id: definition.id },
                    { name: e.target.value }
                  )
                }
              />
            </div>
          )}
        </For>
      )}
    </State>
  )
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
