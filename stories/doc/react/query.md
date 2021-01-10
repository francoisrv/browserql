# UseQuery

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "react"
  }
}
```

A React component that wraps the apollo hooks. They do the same thing as hooks -- you would use them for cosmetic preferences only.

## Side-to-side comparison with Apollo Hooks

```component
{
  "component": "UseQuerySideToSideComparison",
  "props": {}
}
```

## Variables

If the query has variables, enter them via the `variables` prop:

```javascript
function View() {
  return <UseQuery query={GET_USER} variables={{ id: '1' }} />
}
```

```snapshot
React.UseQueryVariables
```

## Rendering loading states

By default, a loading state returns an empty `React` fragment.

You can specify a loading view via the `renderLoading` prop:

```javascript
function User {
  return (
    <UseQuery
      query={GET_USER}
      renderLoading={<div>Loading..</div>}
    />
  )
}
```

```snapshot
React.UseQueryLoading
```

## Handling errors

By default, an error state returns an empty `React` fragment.

You can specify an error view via the `renderError` prop which accepts a function that returns a `React Element`:

```javascript
function User {
  return (
    <UseQuery
      query={GET_USER}
      renderError={({ error }) => <div>{error.message}</div>}
    />
  )
}
```

```snapshot
React.UseQueryError
```

## Lazy loading

By default, when requiring a query, the latter gets executed right away.

You can choose lazy mode instead so you can call the query whenever you want.

```javascript
function User {
  return (
    <UseQuery lazy query={GET_USER}>
      {(getUser, data, { loading }) => (
        <button onClick={() => getUser({ id: 1234 })} disabled={loading}>
          {data && !data.getUser && 'No user found'}
          {data && data.getUser && data.getUser.name}
          {!data && loading && 'Loading'}
          {!data && !loading && 'Anonymous'}
        </button>
      )}
    </UseQuery>
  )
}
```

```snapshot
React.UseLazyQuery
```
