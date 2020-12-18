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

## With apollo hooks

```jsx
import { useMutation } from '@apollo/client'

function sayHello({ to }) {
  const { data, loading, error } = useMutation(DO_SOMETHING, {
    variables: {
      to: 'everybody',
    },
  })

  if (error) return <div>{error.message}</div>

  if (loading) return <div>Loading...</div>

  return <p>{data.sayHello}</p>
}
```

## With components

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
