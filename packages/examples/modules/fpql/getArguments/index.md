Get node's arguments

## Get field's arguments

{{ show fields.graphql }}

{{ show fields.mjs }}

```snapshot2
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

```snapshot2
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

```snapshot2
FPQL.GetExecutableOperationArguments
```
