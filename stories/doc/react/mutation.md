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

## Side-to-side comparison with apollo hooks

### GraphQL schema

```graphql
type Query {
  getSelectedTab: Int! @default(value: 0)
}

type Mutation {
  selectTab(index: Int!): Int!
}
```

### Resolvers

```javascript
import cacheql from '@browserql/cache'
import { buildQuery, buildMutation } from '@browserql/operations'

const cached = cacheql(client.cache, schema)

const GET_SELECTED_TAB = buildQuery(schema, 'getSelectedTab')
const SELECT_TAB = buildMutation(schema, 'selectTab')

const queries = {
  getSelectedTab() {
    return cached.get(GET_SELECTED_TAB)
  },
}

const mutations = {
  selectTab({ index }) {
    cached.set(GET_SELECTED_TAB, index)
    return index
  },
}
```

### With apollo hooks

```javascript
import { useQuery, useMutation } from '@apollo/client'

function Tabs() {
  const { data, error, loading } = useQuery(GET_SELECTED_TAB)
  const [selectTab, selectTabState] = useMutation(SELECT_TAB)

  if (error || selectTabState.error) {
    return <div>Error</div>
  }

  if (loading) return <div>Loading</div>

  return (
    <select
      value={data.getSelectedTab}
      onChange={(event) => selectTab(Number(event.target.value))}
      disabled={selectTabState.loading}
    >
      <option value={0}>Tab 1</option>
      <option value={1}>Tab 2</option>
    </select>
  )
}
```

### With components

```javascript
import { UseMutation, UseQuery } from '@browserql/react'

function Tabs() {
  return (
    <UseQuery
      query={GET_SELECTED_TAB}
      renderLoading={<div>Loading</div>}
      renderError={() => <div>Error</div>}
    >
      {(selectedTab) => (
        <UseMutation mutation={SELECT_TAB}>
          {(selectTab, { loading, error }) => (
            <select
              disabled={loading}
              value={selectedTab}
              onChange={(event) => selectTab(Number(event.target.value))}
            >
              <option value={0}>Tab 1</option>
              <option value={1}>Tab 2</option>
            </select>
          )}
        </UseMutation>
      )}
    </UseQuery>
  )
}
```
