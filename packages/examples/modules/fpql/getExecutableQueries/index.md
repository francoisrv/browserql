Get queries from an executable query

```javascript
import { getExecutableQueries } from '@browserql/fpql'
```

```graphql
query {
  query1

  query2
}
```

```javascript
getExecutableQueries(schema)
```

```snapshot2
FPQL.WithQueryExample
```

## Support multiple operations

```graphql
query Query1 {
  query1
}

mutation Mutation1 {
  mutation1
}

query Query2 {
  query2
}
```

```javascript
getExecutableQueries(schema)
```

```snapshot2
FPQL.WithMultipleQueriesExample
```
