# GraphiQL

`browserql` implementation for [GraphiQL](http://graphiql.com)

## Usage

```graphql
type Query {
  sayHello(to: String!): String!
}

type Mutation {
  sayByeTo(to: String!): String!
}
```

```javascript
import { BrowserqlProvider } from '@browserql/schema'
import GraphiQL from '@browserql/graphiql'

function Provider() {
  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <GraphiQL />
    </BrowserqlProvider>
  )
}
```

{{ render example.tsx }}
