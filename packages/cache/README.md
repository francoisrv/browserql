# cachenez

```jsx
import makeCacheState from '@browserql/cache-state'
import make from '@browserql/cache-state-react'

const schema = gql`
  type Query {
    isConnected: Boolean! @default(value: false)
  }
`

const cacheState = makeCacheState(cache, schema)

const query = gql`
  {
    isConnected
  }
`

cacheState.get({ query }) // { isConnected: false }

cacheState.set({ query, data: { isConnected: true } })
cacheState.get({ query }) // { isConnected: false }

cacheState.set({
  query,
  data(current) {
    return !current
  },
})
cacheState.get({ query }) // { isConnected: true }

cacheState.toggle({ query })
cacheState.get({ query }) // { isConnected: false }

const CacheState = make(cache, schema)

function AccessQuery() {
  return (
    <CacheState query={query}>
      {({ isConnected }, setState) => (
        <>
          <input
            type="checkbox"
            checked={isConnected}
            onChange={setState.toggle}
          />
          <span>You are signed {isConnected ? 'in' : 'out'}</span>
        </>
      )}
    </CacheState>
  )
}

function AccessSelected() {
  return (
    <CacheState query={query} select="isConnected">
      {(isConnected, setIsConnected) => (
        <>
          <input
            type="checkbox"
            checked={isConnected}
            onChange={setIsConnected.toggle}
          />
          <span>You are signed {isConnected ? 'in' : 'out'}</span>
        </>
      )}
    </CacheState>
  )
}

function AccessSelected() {
  return (
    <CacheState query={query} select="isConnected" variables={{ user: 1234 }}>
      {(isConnected, setIsConnected) => (
        <>
          <input
            type="checkbox"
            checked={isConnected}
            onChange={setIsConnected.toggle}
          />
          <span>You are signed {isConnected ? 'in' : 'out'}</span>
        </>
      )}
    </CacheState>
  )
}
```
