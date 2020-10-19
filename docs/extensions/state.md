# State

## Usage

```graphql
// schema.graphql

type State @state {
  isLoggedIn: Boolean!
}
```

```js
import connect from '@browserql/client'
import { connectState, makeState } from '@browserql/state'

const client = connect(connectState({ schema }))

const state = makeState(client)

state.State.isLoggedIn.get()
state.State.isLoggedIn.set(false)
state.State.isLoggedIn.toggle()
```

## API

### get

### change

### toggle

### increment

### multiply

### concat

### push

### pull
