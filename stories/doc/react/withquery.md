# With Query High Order Component

You can also use a HOC

## Side-to-side comparison with apollo hooks, components and HOCs

```graphql
type Query {
  sayHello(to: String!): String!
}
```

### With apollo hooks

```jsx
import { useQuery } from '@apollo/client'

function sayHello({ to }) {
  const { data, loading, error } = useQuery(SAY_HELLO, {
    variables: {
      to: 'everybody',
    },
  })

  if (error) return <div>{error.message}</div>

  if (loading) return <div>Loading...</div>

  return <p>{data.sayHello}</p>
}
```

### With components

```jsx
import { WithQuery } from '@browserql/react'

function SayHello({ to }) {
  return (
    <WithQuery
      query={SAY_HELLO}
      variables={{ to: 'everybody' }}
      renderError={({ error }) => <div>{error.message}</div>}
      renderLoading={<div>Loading...</div>}
    >
      {(response) => <p>{response}</p>}
    </WithQuery>
  )
}
```

### With HOC

```jsx
import { withQuery } from '@browserql/react'

withQuery(SAY_HELLO, { to: 'everybody' })(function SayHello({ sayHello }) {
  if (sayHello.error) return <div>{sayHello.error.message}</div>

  if (sayHello.loading) return <div>Loading...</div>

  return <p>{sayHello.data}</p>
})
```

```snapshot
React.WithQueryExample
```
