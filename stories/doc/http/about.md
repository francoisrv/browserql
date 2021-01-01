# HTTP

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "http"
  }
}
```

Fire HTTP queries from your front end using GraphQL!

```graphql
type Query {
  getTodo(id: ID!): Todo
    @http(url: "https://jsonplaceholder.typicode.com/todos/:id")
}
```

```javascript
import { connectHttp } from '@browserql/http'
import connect from '@browserql/client'
import resolved from '@browserql/resolve'
import schema from './schema.graphql'

const { client, schema: finalSchema } = connect(schema, connectHttp())
const { Query } = resolve(finalSchema)

await client.query(Query.getTodo({ id: 2 }))
```

```snapshot
HTTP.Example
```

## Arguments

```section-h3
http/url
```
