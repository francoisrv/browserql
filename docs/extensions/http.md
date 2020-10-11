# http

## Usage

```graphql
# schema.graphql

type Customer {
  id: ID!
  name: String!
}

type Query {
  getCustomer(id: ID!): Customer
    @httpGet(url: "https://api.com/v1/customer/:id")
}

type Mutation {
  addCustomer(name: String!): Customer
    @httpPost(url: "https://api.com/v1/customer")
}
```

### Connect

```js
import connect from '@browserql/client'
import connectHttp from '@browserql/http'
import resolve from '@browserql/resolved'

import schema from './schema.graphql'

const { client, schema: finalSchema } = connect({ schema }, connectHttp())

const resolved = resolve(finalSchema)

await client.query(resolved.Query.getCustomer({ id: '1234' }))
```

### With React

```jsx
import { Httpql, useHttp } from '@browserql/http-react'

function Customer() {
  return (
    <Httpql
      query="getCustomer"
      variables={{ id: props.id }}
      render={(customer) => <div>Hello {customer.name}</div>}
    />
  )
}

function AddCustomer() {
  const [name, setName] = React.useState('')
  const { run, loading, error, data } = useHttp().mutation('addCustomer')

  const handleSubmit = () => {
    run({ name })
  }

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="submit" onClick={handleSubmit} />
    </>
  )
}

render(
  <ApolloProvider client={client}>
    <Customer />
    <AddCustomer />
  </ApolloProvider>
)
```
