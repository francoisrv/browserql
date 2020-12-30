Merge different schemas together

## Identical types

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

## Extending unknown type

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
