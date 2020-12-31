The following resolvers are supported:

- queries
- mutations
- scalars
- directives

They are all a dictionnary of functions that receive the following parameters:

- `variables`
- `context`

The context has a reference to the browserql client accessible via `context.browserqlClient`

### Queries and mutations

In this example, we'll use the cache-only state system to store a flag.

This is a good example because here the queries and the mutations are using their context argument in order to access apollo's cache.

```javascript
import gql from 'graphql-tag'
import cacheql from '@browserql/cache'

const defs = gql`
  type Query {
    isLoggedIn: Boolean
  }

  type Mutation {
    login: Boolean
  }
`

const isLoggedIn = (variables, context) {
  const { cache, schema } = context.browserqlClient
  const cached = cacheql(cache, schema)
  return cached.get(gql`query { isLoggedIn }`)
}

const login = (variables, context) {
  const { cache, schema } = context.browserqlClient
  const cached = cacheql(cache, schema)
  cached.set(gql`query { isLoggedIn }`, true)
}

// Now we connect everything
const { client } = connect({
  schema: defs,
  queries: { isLoggedIn },
  mutations: { login }
})

```

```snapshot
Client.ResolversExample
```
