Get a value node

```graphql
enum Foo {
  Bar
}

directive @variant(admin: Boolean!) on FIELD_DEFINITION

type Query {
  getUser: User @variant(admin: true foo: Foo = Bar)
}
```

## Get directive argument value

```javascript
import { getValue, getField, getQuery } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getQuery('getUser'), getField('foo'), getValue)
```

{{ render field-argument-value.tsx }}
