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
    logout: Boolean
  }
`

const IS_LOGGED_IN = gql`
  query {
    isLoggedIn
  }
`

const isLoggedIn = () => false // default value

const login = (variables, context) => {
  const { cache, schema } = context.browserqlClient
  cacheql(cache, schema).set(IS_LOGGED_IN, true)
}

const logout = (variables, context) => {
  const { cache, schema } = context.browserqlClient
  cacheql(cache, schema).set(IS_LOGGED_IN, false)
}

// Now we connect everything
const { client } = connect({
  schema: defs,
  queries: { isLoggedIn },
  mutations: { login, logout },
})
```

```graphql
query IS_LOGGED_IN {
  isLoggedIn
}

mutation LOGIN {
  login
}

mutation LOGOUT {
  logout
}
```

```javascript
compose(
  withMutation`login`(LOGIN),
  withMutation`logout`(LOGOUT)
)(function Inner({ login, logout }) {
  return (
    <UseQuery query={IS_LOGGED_IN}>
      {({ isLoggedIn }) => (
        <Button
          fullWidth
          onClick={isLoggedIn ? login.execute : logout.execute}
          color={isLoggedIn ? 'secondary' : 'primary'}
          variant="contained"
        >
          {isLoggedIn ? 'Log out' : 'Log in'}
        </Button>
      )}
    </UseQuery>
  )
})
```

```snapshot
Client.ResolversExample
```
