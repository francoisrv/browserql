# fpql

```javascript
import { getType, getDirective, getArgument } from '@browserql/fpql'
import fp from '@browserql/fp'
import gql from 'graphql-tag'

fp(`
  type Todo {
    name: String! @foo(bar: 2)
  }
`)(gql, getType('Todo'), getDirective('foo'), getArgument('bar')) // 2
```
