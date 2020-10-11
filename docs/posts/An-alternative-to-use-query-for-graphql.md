# An alternative to useQuery in GraphQL

Apollo makes it really easy to use GraphQL in a React app via the `useQuery` and `useMutation` hooks. We all love React hooks. Yet today I'd like to show an alternative to these hooks, using a component instead

## Introducing Browserql

[Browserql](https://pages.github.io/francoisrv/browserql/#/react?id=Browserql) is a component wrapping around hooks. So it's a coding style option if you rather use a component than hooks in your code

## Use query

Show me some code:

```jsx
import React from 'react'
import { useQuery } from '@apollo/client'
import { Browserql } from '@browserql/react'

function View(props) {
  // -----------
  // USING HOOKS
  // -----------

  const { data, loading, error } = useQuery(QUERY, { name: props.name })
  if (error) return <div>{error.message}</div>
  if (loading) return <div>Loading</div>
  if (!data.getTodo) return <div>Not found</div>
  return <h1>{data.getTodo.name}</h1>

  // ---------------
  // USING COMPONENT
  // ---------------

  return (
    <Browserql
      query={QUERY}
      variables={{ name: props.name }}
      renderLoading={<div>Loading</div>}
      renderError={(error) => <div>{error.message}</div>}
      render={(todo) => (todo ? <h1>{todo.name}</h1> : <div>Not found</div>)}
    />
  )
}
```

**`Browserql` actually uses the apollo hooks, so this is a sugar-coated option. More like a coding preference.**

## Use mutation

Mutation is pretty similar. It is also a component wrapper, but this time of the `useMutation` hook

A quick side-to-side comparison of hook vs component:

```jsx
function Action() {
  // with hook
  const [mutate, { loading, error }] = useMutation(MUTATION)
  const handleClick = () => mutate({})
  return <input type="submit" onClick={handleClick} disabled={loading} />

  // with component
  return (
    <Browserql
      mutation={MUTATION}
      render={(mutate, { loading, error }) => {
        const handleClick = () => mutate({})
        return <input type="submit" onClick={handleClick} disabled={loading} />
      }}
    />
  )
}
```

## To sum it up

Using a component instead of a hook is just a matter of personal code cosmetic preferences.

I personally find components useful to create re-usable components.

I personally have the following as a base action button:

```jsx
function BaseAction(props) {
  return (
    <Browserql
      mutation={props.mutation}
      render={(data, { loading }) => (
        <button disabled={loading} onClick={() => data(props.variables)}>
          {props.label}
        </button>
      )}
    />
  )
}
```

Which can then be called like this:

```jsx
function AddTodo() {
  const [name, setName] = React.useState('')

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <BaseAction mutation={ADD_TODO} variables={{ name }} label="Add todo" />
    </form>
  )
}
```

Or the following for data lists:

```jsx
function DataList(props) {
  return (
    <Browserql
      query={props.query}
      variables={props.variables}
      render={(data, { loading }) => <List items={data} />}
    />
  )
}
```

Which can then be called like this:

```jsx
function Todos() {
  return <DataList query={GET_TODOS} />
}
```
