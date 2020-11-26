# BrowserqlQuery2

A React component that wraps the apollo hooks. They do the same thing as hooks -- you would use them for cosmetic preferences only.

## Side to side comparison between apollo hooks and BrowserqlQuery

### With Apollo hooks

```js
import { useQuery } from '@apollo/client'

function Query() {
  const { data, loading, error } = useQuery(QUERY)
  if (error) {
    return <div>{error.message}</div>
  }
  if (loading) {
    return <div>Loading</div>
  }
  return <div>{JSON.stringify(data)}</div>
}
```

### With BrowserqlQuery

```jsx
// stuff
import { BrowserqlQuery } from '@browserql/react'

function Query() {
  return (
    <BrowserqlQuery
      query={QUERY}
      renderLoading={<div>Loading</div>}
      renderError={(e) => <div>{error.message}</div>}
    >
      {(data) => <div>{JSON.stringify(data)}</div>}
    </BrowserqlQuery>
  )
}
```

| Props             | Description                                   | Required | Type                  |
| ----------------- | --------------------------------------------- | -------- | --------------------- |
| **query**         | The query to be executed                      | Yes      | GraphQL Document Node |
| **variables**     | The query variables                           | No       | object                |
| **queryProps**    | The props to be passed to apollo's `useQuery` | No       |
| **renderError**   | Specify a view to render on query error       | No       | React Component       |
| **renderLoading** | Specify a view to render on loading           | No       | React Element         |
