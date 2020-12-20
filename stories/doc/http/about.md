# HTTP

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "http"
  }
}
```

```graphql
extend type Query {
  getTodo(id: ID!): Todo
    @httpGet(url: "https://jsonplaceholder.typicode.com/todos/:id")
}
```

```javascript
import { buildHttp } from '@browserql/http'

const { schema, queries, mutations } = buildHttp(schema)

await client.query({
  query: gql`
    query GetTodo($id: ID!) {
      getTodo(id: $id) {
        user
        id
        title
        completed
      }
    }
  `,
  // https://jsonplaceholder.typicode.com/todos/2
  variables: { id: 2 },
})
```

```snapshot
HTTP.Example
```

### Http Methods supported

- DELETE `httpDelete`
- GET `httpGet`
- HEAD `httpHead`
- OPTIONS `httpOptions`
- PATCH `httpPatch`
- POST `httpPost`
- PUT `httpPut`
