# fpql

```component
{
  "component": "stories/components/NPMBadge",
  "props": {
    "pkg": "fpql"
  }
}
```

Suite of utilities to traverse a GraphQL schema. Use functional programming.

```javascript
import {
  getArgument,
  getDirective,
  getField,
  getType,
  getValue,
} from '@browserql/fpql'
import fp from '@browserql/fp'
import gql from 'graphql-tag'

const schema = gql
```

```graphql
type MyType {
  myField: String! @myDirective(a: 24, b: "hello", c: false, d: 245.76, e: [24])
}
```

```javascript
fp(schema)(
  getType('MyType'),
  getField('myField'),
  getDirective('myDirective'),
  (directive) => ({
    a: fp(directive)(getArgument('a'), getValue),
    b: fp(directive)(getArgument('b'), getValue),
    c: fp(directive)(getArgument('c'), getValue),
    d: fp(directive)(getArgument('d'), getValue),
    e: fp(directive)(getArgument('e'), getValue),
  })
)
```

```snapshot
FPQL.Base
```

## API

```section
Get Argument
utils/fpql/getArgument
Get given node's argument by name
```

```section-h3
utils/fpql/getArguments
```

```section-h3
utils/fpql/getDefaultValue
```

```section-h3
utils/fpql/getDirective
```

```section-h3
utils/fpql/getExecutableOperation
```

```section-h3
utils/fpql/getExecutableOperations
```

```section-h3
utils/fpql/getExecutableQueries
```

```section-h3
utils/fpql/getKind
```

```section-h3
utils/fpql/getName
```

```section-h3
utils/fpql/getScalar
```

```section-h3
utils/fpql/getScalars
```

```section-h3
utils/fpql/getSelections
```

```section-h3
utils/fpql/getTypes
```

```section-h3
utils/fpql/getValue
```

```section-h3
utils/fpql/group
```

```section-h3
utils/fpql/merge
```

```section-h3
utils/fpql/parseKind
```