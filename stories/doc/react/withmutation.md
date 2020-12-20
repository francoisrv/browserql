# With Mutation High Order Component

## Side-to-side comparison with apollo hooks, components and HOCs

```graphql
extend type Mutation {
  doSomething(id: ID!): ID!
}
```

### With apollo hooks

```javascript
import { useMutation } from '@apollo/client'

function DoSomething({ id }) {
  const [doSomething, { loading, error }] = useMutation(DO_SOMETHING, {
    variables: { id },
  })

  return (
    <button onClick={() => doSomething({ id })} disabled={loading}>
      Do something
    </button>
  )
}
```

### With components

```javascript
import { WithMutation } from '@browserql/react'

function DoSomething({ id }) {
  return (
    <WithMutation mutation={DO_SOMETHING}>
      {(doSomething, { loading, error }) => (
        <button onClick={() => doSomething({ id })} disabled={loading}>
          Do something
        </button>
      )}
    </WithMutation>
  )
}
```

### With HOC

```javascript
import { withMutation } from '@browserql/react'

function DoSomething({ doSomething, id }) {
  return (
    <button
      onClick={() => doSomething.execute({ id })}
      disabled={doSomething.loading}
    >
      Do something
    </button>
  )
}

withMutation('doSomething')(DoSomething)
```
