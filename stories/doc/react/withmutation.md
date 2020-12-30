# With Mutation High Order Component

## Side-to-side comparison with apollo hooks, components and HOCs

```graphql
type Mutation {
  log(message: String!): ID!
}
```

```javascript
const mutations = {
  log({ message }) {
    console.log(message)
    return Date.now()
  },
}
```

### With apollo hooks

```javascript
import { useMutation } from '@apollo/client'

function Log({ message }) {
  const [log, { loading, error }] = useMutation(LOG)

  return (
    <button onClick={() => log({ message })} disabled={loading}>
      Log: {message}
    </button>
  )
}
```

### With components

```javascript
import { UseMutation } from '@browserql/react'

function Log({ message }) {
  return (
    <UseMutation mutation={LOG}>
      {(log, { loading, error }) => (
        <button onClick={() => log({ message })} disabled={loading}>
          Log: {message}
        </button>
      )}
    </UseMutation>
  )
}
```

### With HOC

```javascript
import { withMutation } from '@browserql/react'

function Log({ log, message }) {
  return (
    <button onClick={() => log.exec({ message })} disabled={log.loading}>
      Log: {message}
    </button>
  )
}

withMutation(LOG)(DoSomething)
```
