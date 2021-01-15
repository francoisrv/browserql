```javascript
import connect from '@browserql/client'
import gql from 'graphql-tag'
import cacheql from '@browserql/cache'

// Define your GraphQL schema
const schema = gql`
  type Query {
    getCounter: Int!
  }

  type Mutation {
    incrementCounter: Boolean!
  }
`

const GET_COUNTER = buildQuery(schema, 'getCounter')
const INCREMENT_COUNTER = buildMutation(schema, 'incrementCounter')

// Define your queries resolvers
const queries = {
  getCounter() {
    return 0
  },
}

// Define your mutations resolvers
const mutations = {
  incrementCounter(_variables, ctx) {
    const {
      context: { cache },
      schema,
    } = ctx.browserqlClient
    cache.increment(GET_COUNTER)
    return true
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
