# API

## add

## asc

Tell a query to sort results by ascending order.
Expect `true` or `false` as argument.

By default, asc is `true`

```javascript
import { asc } from '@browserql/firestore'

firestoreql.get('Todo', asc(false))
```

```typescript
asc(value: boolean): {
  type: FirestoreqlType.getter
  name: 'asc'
  value: boolean
}
```

## build

```javascript
import { build } from '@browserql/firestore'

build(
  firestore(),
  gql`
    type Todo @firestore {
      name: String!
    }
  `
)
```

```typescript
buildFirestoreql(
  db: firestore.Firestore.Database
  schema: string | DocumentNode
): {
  type: FirestoreqlType.asc
  value: boolean
}
```

## connect

```javascript
import { connect } from '@browserql/firestore'
```

## first

```javascript
import { first } from '@browserql/firestore'
```

## increment

```javascript
import { increment } from '@browserql/firestore'
```

## last

```javascript
import { last } from '@browserql/firestore'
```

## limit

```javascript
import { limit } from '@browserql/firestore'
```

## multiply

```javascript
import { multiply } from '@browserql/firestore'
```

## orderBy

```javascript
import { orderBy } from '@browserql/firestore'
```

## page

```javascript
import { page } from '@browserql/firestore'
```

## set

```javascript
import { page } from '@browserql/firestore'
```

## where

```javascript
import { where } from '@browserql/firestore'
```
