# fpql

```component
{
  "component": "NPMBadge",
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

```snapshot3
FPQLExample
```

## API

### getArgument

Get node's argument by name

```javascript
import { getArgument } from '@browserql/fpql'
```

```graphql
type A @foo(bar: 24) {
  id: ID!
}
```

```javascript
const type = getType('A')(schema)
const directive = getDirective('foo')(type)

getArgument('bar')(directive)

fp(schema)(getType('A'), getDirective('foo'), getArgument('bar'), getValue)
```

```snapshot
FPQL.GetDirectiveArgument
```

### getDirective

Get node's directive by name

```javascript
import { getDirective } from '@browserql/fpql'
```

```graphql
type A @foo {
  id: ID! @foo
}
```

```javascript
const type = getType('A')(schema)
const directive = getDirective('foo')(type)
getName(directive)
```

```snapshot2
MISSING SNAPSHOT TEST
```

### getName

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

```snapshot
FPQL.GetTypesNames
```

### getTypes

Get all types from a schema

```javascript
import { getTypes } from '@browserql/fpql'
```

```graphql
type A {
  id: ID
}

type B {
  id: ID
}
```

```javascript
getTypes(schema).map(getName)
```

```snapshot
FPQL.GetTypes
```

### group

Group extensions together

```javascript
import { group } from '@browserql/fpql'
```

```graphql
type Query {
  a: Int
}

extend type Query {
  b: Int
}
```

```javascript
group(schema)
```

```snapshot
FPQL.Group
```

### merge

Merge different schemas together

### Identical types

Identical types will be extended

```javascript
import { merge } from '@browserql/fpql'
```

```graphql
# A.graphql
type Query {
  id: ID
}
```

```graphql
# B.graphql
type Query {
  foo: ID
}
```

```javascript
merge(A, B)
```

```snapshot
FPQL.MergeExtendExistingTypes
```

### Extending unknown type

Extending an unknown type will cause the extension to be removed

```javascript
import { merge } from '@browserql/fpql'
```

```graphql
extend type Query {
  id: ID
}
```

```javascript
merge(schema)
```

```snapshot
FPQL.MergeRemoveExtension
```
