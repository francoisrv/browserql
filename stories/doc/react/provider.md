# Browserql React Provider

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "react"
  }
}
```

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

import { BrowserqlProvider } from '@browserql/react'
import { buildQuery } from '@browserql/operations'

const queries = {
  sayHello({ to }) {
    return `Hello ${to}`
  },
}

function SayHello({ to }) {
  const { data, loading } = useQuery(buildQuery(schema, 'sayHello'), {
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

| Prop           | About                               | Type                                                               | Required                                        | Default |
| -------------- | ----------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- | ------- |
| **client**     | A browserql client                  | `BrowserqlClient`                                                  | If you are using it, it has to be the only prop | N/A     |
| **schema**     | GraphQL definitions                 | `DocumentNode`                                                     | N                                               | N/A     |
| **queries**    | A dictionary of query resolvers     | `Record<string, (variables: V, ctx: BrowserqlClientContext) => D>` | N                                               | N/A     |
| **mutations**  | A dictionary of mutation resolvers  | `Record<string, (variables: V, ctx: BrowserqlClientContext) => D>` | N                                               | N/A     |
| **scalars**    | A dictionary of scalar resolvers    | `Record<string, GraphQLScalarType>`                                | N                                               | N/A     |
| **directives** | A dictionary of directive resolvers | `Record<string, SchemaDirectiveVisitorClass>`                      | N                                               | N/A     |
