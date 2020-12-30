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
getExecutableQueries(schema).map(getName)
```

```snapshot
FPQL.GetTypesNames
```
