# Browserql React Provider

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "react"
  }
}
```

```sandbox
react-provider-ruh7c
```

```graphql
extend type Query {
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
