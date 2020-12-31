# Browserql React Provider

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "react"
  }
}
```

The browserql react provider creates a new browserql client and keeps it under a react context so it is accessible to all its children

```sandbox2
react-provider-ruh7c
```

```graphql
type Query {
  sayHello(to: String!): String!
}
```

```javascript
import React from 'react'
import { useQuery } from '@apollo/client'

import { BrowserqlProvider, BrowserqlContext } from '@browserql/react'
import { buildQuery } from '@browserql/operations'

const queries = {
  sayHello({ to }) {
    return `Hello ${to}`
  },
}

function SayHello({ to }) {
  const context = useContext(BrowserqlContext)
  const query = buildQuery(context.schema, 'sayHello')

  const { data, loading } = useQuery(query, {
    variables: { to },
  })

  if (loading) return <div>Loading...</div>

  return <p>{data.sayHello}</p>
}

export default function App() {
  return (
    <BrowserqlProvider schema={schema} queries={queries}>
      <SayHello to="everybody" />
    </BrowserqlProvider>
  )
}
```

```snapshot
React.SandboxMainExample
```

## Props

You can either pass directly a `browserql` client using the `client` prop -- or use any other props to have the provider make the client.

| Prop           | About                                                  | Type                                                               | Required                                        | Default |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------- | ------- |
| **client**     | A browserql client                                     | `BrowserqlClient`                                                  | If you are using it, it has to be the only prop | N/A     |
| **schema**     | GraphQL definitions                                    | `DocumentNode`                                                     | N                                               | N/A     |
| **queries**    | A dictionary of query resolvers                        | `Record<string, (variables: V, ctx: BrowserqlClientContext) => D>` | N                                               | N/A     |
| **mutations**  | A dictionary of mutation resolvers                     | `Record<string, (variables: V, ctx: BrowserqlClientContext) => D>` | N                                               | N/A     |
| **scalars**    | A dictionary of scalar resolvers                       | `Record<string, GraphQLScalarType>`                                | N                                               | N/A     |
| **directives** | A dictionary of directive resolvers                    | `Record<string, SchemaDirectiveVisitorClass>`                      | N                                               | N/A     |
| **extensions** | An argument that can be passed to a `browserql` client | `BrowserqlClientOption[]`                                          | N                                               | N/A     |

### client

You can pass directly an instance of a [browserql client](/client/usage)

```javascript
import connect from '@browserql/client'

const client = connect(schema)

function Foo() {
  return (
    <BrowserqlProvider client={client}>
      <App />
    </BrowserqlProvider>
  )
}
```

```snapshot
React.ProviderClientProp
```

Or pass any argument accepted as an argument by the [connect function](/client/usage):

```graphql
scalar JSON

directive @variant(name: VARIANT) on FIELD_DEFINITION

enum VARIANT {
  HIGH
  LOW
}

type Query {
  getHigh: JSON @variant(name: HIGH)
}

type Mutation {
  changePitchLevel(level: Float!): JSON!
}
```

```javascript
import { JSONResolver } from 'graphql-scalars'

function Foo() {
  return (
    <BrowserqlProvider
      schema={schema}
      queries={{
        getHigh() {},
      }}
      mutations={{
        changePitchLevel({ level }) {},
      }}
      scalars={{ JSON: JSONResolver }}
      directives={{ variant: VariantResolver }}
    >
      <App />
    </BrowserqlProvider>
  )
}
```

```snapshot
React.ProviderClientProp
```
