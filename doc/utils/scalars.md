# Scalars

This is a wrapper to use [graphql-scalars](https://github.com/Urigo/graphql-scalars) with `browserql` client.

```javascript
import connect from '@browserql/client'
import connectScalars from '@browserql/scalars'

connect(
  {
    schema: `
  type Foo {
    data: JSON!
  }
  `,
  },
  connectScalars()
)
```
