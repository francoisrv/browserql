Get the name of any GraphQL node

```javascript
import { getName } from '@browserql/fpql'
```

```graphql
type A {
  id: ID!
}
```

```javascript
getTypes(schema).map(getName)
```

```snapshot2
FPQL.GetTypesNames
```
