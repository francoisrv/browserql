Get node's arguments

## Get field's arguments

```graphql
type Query {
  sayHello(to: String = "everybody"): String!
}
```

```javascript
import { getArguments, getQuery } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getQuery('sayHello'), getArguments)
```

```snapshot
FPQL.GetFieldArguments
```

## Get directive's arguments

```graphql
type User @model(collection: "users") {
  email: EmailAddress!
}
```

```javascript
import { getArguments, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getType('User'), getDirective('model'), getArguments)
```

```snapshot
FPQL.GetDirectiveArguments
```

## Get executable operation's arguments

```graphql
query Get($page: Int = 1) {
  get(page: $page)
}
```

```javascript
import { getArguments, getExecutableOperation } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getExecutableOperation('Get'), getArguments)
```

```snapshot
FPQL.GetExecutableOperationArguments
```
