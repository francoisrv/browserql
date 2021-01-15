# REST

```component
{
  "component": "NPMBadge",
  "props": {
    "pkg": "rest"
  }
}
```

```graphql
type Todo @rest(path: "/todos") {
  title: String
  done: Boolean @default(value: false)
}
```

```javascript
import { buildRest, restql } from '@browserql/rest'

const { schema, queries, mutations, context } = buildRest(schema, {
  baseUrl: 'http://api.com/v1',
  headers: {
    Access: 'Bearer TOKEN',
  },
})

// GET http://api.com/v1/todos
await client.query(context.get('Todo'))

// GET http://api.com/v1/todos/1234
await client.query(context.get('Todo', 1234))

// GET http://api.com/v1/todos?done=1
await client.query(context.get('Todo', { done: true }))

// POST http://api.com/v1/todos { "title": "Buy milk", "done": false }
await client.query(context.post('Todo', { title: 'Buy milk' }))

// PUT http://api.com/v1/todos/1234 { "done": true }
await client.query(context.put('Todo', 1234, { done: true }))

// DELETE http://api.com/v1/todos/1234
await client.query(context.delete('Todo', 1234))
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
