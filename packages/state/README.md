@browserql/state
===

```graphql
type State @state {
  counter: Int! @initialState(value: 1)
}
```

```js
import connect from '@browserql/client'
import state from '@browserql/state'

const client = connect({ schema, plugins: [state()] })

const withCounter = state(client).withState('State.counter')

let results = await withCounter.get()
console.log(results.data) // 1

await withCounter.set(1)

results = await withCounter.get()
console.log(results.data) // 2
```

