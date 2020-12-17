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
    @httpGet(
      url: "https://jsonplaceholder.typicode.com/todos"
      useVariablesAsPathParameters: true
    )
}

type Todo {
  userId: ID!
  id: ID!
  title: String!
  completed: Boolean!
}
```

```javascript
import { buildHttp, httpGet } from '@browserql/http'

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

```json
{
  "userId": 1,
  "id": 2,
  "title": "quis ut nam facilis et officia qui",
  "completed": false
}
```

```graphql
input HttpHeader {
  name: String!
  value: String!
}

directive @httpGet(
  url: String
  pathname: String
  headers: [HttpHeader!]
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
) on FIELD_DEFINITION

directive @httpHead(
  url: String
  pathname: String
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
) on FIELD_DEFINITION

directive @httpOptions(
  url: String
  pathname: String
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
) on FIELD_DEFINITION

directive @httpDelete(
  url: String
  pathname: String
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
) on FIELD_DEFINITION

directive @httpPost(
  url: String
  pathname: String
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
  useVariablesAsPayload: Boolean = false
) on FIELD_DEFINITION

directive @httpPut(
  url: String
  pathname: String
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
  useVariablesAsPayload: Boolean = false
) on FIELD_DEFINITION

directive @httpPatch(
  url: String
  pathname: String
  useVariablesAsPathParameters: Boolean = false
  useVariablesAsSearchParameters: Boolean = false
  useVariablesAsPayload: Boolean = false
) on FIELD_DEFINITION
```
