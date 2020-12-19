# browserql Client

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "client"
  }
}
```

The browserql client is a wrapper around apollo server, running in local memory of the browser.

To use it, just pass it a schema and some resolvers.

```javascript
import connect from '@browserql/client'
import gql from 'graphql-tag'

// Define your GraphQL schema
const schema = gql`
  extend type Query {
    getCounter: Int!
  }

  extend type Mutation {
    incrementCounter: Boolean!
  }
`

// Define your queries resolvers
const queries = {
  getCounter() {
    return 0
  },
}

// Define your mutations resolvers
const mutations = {
  incrementCounter(_variables, ctx) {
    const { cache } = ctx.browserqlClient
    try {
      const response = cache.readQuery({
        query,
      })
      if (response) {
        cache.writeQuery({
          query,
          data: {
            getCounter: response.getCounter + 1,
          },
        })
        return true
      }
      return false
    } catch (error) {
      return false
    }
  },
}

// The query as used by the FE
const query = gql`
  query {
    getCounter
  }
`

// The mutation as used by the FE
const mutation = gql`
  mutation {
    incrementCounter
  }
`

// Create a new browserql client
const { client } = connect({ schema, queries, mutations })

// You can now access queries
async function getCounter() {
  const { data } = await client.query({ query })
  return data.getCounter
}

// And mutations
async function incrementCounter() {
  await client.mutate({ mutation })
}

// Forever increment counter every n seconds
async function demo(seconds = 5) {
  const counter = await getCounter()
  document.writeln('<p>Counter: '.concat(counter).concat('</p>'))
  document.writeln(`<p>Waiting ${seconds} seconds...</p>`)
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  document.writeln('<p>Incrementing counter...</p>')
  await incrementCounter()
  await demo(seconds)
}

demo(2.5).catch(console.error)
```

```sandbox
mystifying-frost-qwhsj
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
