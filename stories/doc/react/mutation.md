# With Mutation

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "react"
  }
}
```

A React component that wraps the apollo hooks. They do the same thing as hooks -- you would use them for cosmetic preferences only.

```graphql
extend type Mutation {
  doSomething(id: ID!): ID!
}
```

## Side-to-side comparison with apollo hooks

### With apollo hooks

```jsx
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