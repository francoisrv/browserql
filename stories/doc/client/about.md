# Client

The browserql client is a wrapper around apollo server running in local memory of the browser.

```js
import connect from ' @broswerql/client'

const { client } = connect({
  schema: gql`
    type Query {
      isLoggedIn: Boolean
    }
  `,
  queries: {
    async isLoggedIn() {
      return true
    },
  },
})

await client.query(gql`
  query {
    isLoggedIn
  }
`)
```
