browserql-core
===

Core plugin for browserql

## Usage

```js
import { connect } from 'browserql'
import defaultValue from 'browserql-default'

const client = connect({
  plugins: [core()]
})
```

## Directives

### default

#### default value for query

You can specify a default return value for a query in case this query has not yet been cached

```graphql
type Query {
  isLoggedIn
}
```

```js
import { connect } from 'browserql'
import { withClient } from 'browserql-with-client'

const schema = `
type Query {
  getVersion: String! @default(value: "1.0.0")
  getCounter: Int! @defaul(value: 0)
  getFlag: Boolean! @default(value: true)
}

type Mutation {
  setVersion(nextVersion: String): String @update(query: "getVersion")
  incrementCounter: Int! @increment(query: "getVersion")
  toggleFlag: Boolean! @toggle(query: "getFlag")
}
`

const resolvers = {
  getVersion: withClient(client => () => client.readQuery('getVersion')),

  setVersion: withClient(client => ({version}) => {
    client.updateQuery('getVersion', {}, version)
    return version
  })
}

const withState = WithState(client)

client.query(withState.get('counter'))

client.mutate(withState.increment('counter'))
```
