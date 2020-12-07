# Client

The browserql client is a wrapper around apollo server running in local memory of the browser.

To use it, just pass it a schema and some resolvers.

```js
import connect from ' @browserql/client'

const { client } = connect({
  schema: gql`
    type Query {
      isMorning: Boolean
    }
  `,
  queries: {
    async isMorning() {
      return new Date().geHours() < 12
    },
  },
})

const {
  data: { isMorning },
} = await client.query(
  gql`
    query {
      isMorning
    }
  `
)
```

## Schema

Pass a schema. It can be either a string or a GraphQL `DocumentNode`

```javascript
const schema = `
  type Query {
    isMorning: Boolean
  }
`

// Connect schema as a string
connect({ schema })

// Connect schema as a document node
connect({ schema: gql(schema) })
```

## Resolvers

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
const schema = gql`
  type Query {
    isLoggedIn: Boolean
  }

  type Mutation {
    login: Boolean
  }
`

const isLoggedIn = (variables, context) {
  const { cache } = context.browserqlClient
  try {
    // return cached value
    const { data: { isLoggedIn } } = cache.read({
      query: gql`query { isLoggedIn }`
    })
    return isLoggedIn
  } catch (error) {
    // if the cache is empty, apollo throws an error
    // so we ignore it and return a default value
    return false
  }
}

const login = (variables, context) {
  // This mutation is just updated the flag value in the query cache
  try {
    const { cache } = context.browserqlClient
    cache.writeQuery({
      query: gql`query { isLoggedIn }`,
      data: {
        isLoggedIn: true
      }
    })
    return true
  } catch (error) {
    return false
  }
}

// Now we connect everything
const { client } = connect({
  schema,
  queries: { isLoggedIn },
  mutations: { login }
})

```
