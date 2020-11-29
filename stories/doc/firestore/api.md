# API

## add

Add a new document in a firestore collection.

### Usage

```javascript
import { add } from '@browserql/firestore'

await client.query(add('Todo', { name: 'buy milk' }))
```

### Typescript signature

```typescript
function add<Model = any>(
  value: boolean,
  variables: Model
): {
  mutation: DocumentNode
  variables: Model
}
```

You can pass more than one document to be added

```javascript
await client.query(add('Todo', { name: 'buy milk' }, { name: 'fix drawer' }))
```

## asc

Tell a query to sort results by ascending order.
Expect `true` or `false` as argument.

By default, asc is `true`

```javascript
import { asc, get } from '@browserql/firestore'

await client.query(get('Todo', asc(false)))
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
build(
  db: firestore.Firestore.Database
  schema: string | DocumentNode
): {
  schema: DocumentNode
  queries: any
  mutations: any
}
```

## connect

```javascript
import { connect } from '@browserql/client'
import { connect as connectFirestore } from '@browserql/firestore'

const browserql = connect(connectFirestore(db, defs))
```

## first

```javascript
import { first, get } from '@browserql/firestore'

await client.query(get('Todo', first()))
```

## increment

```javascript
import { increment, update } from '@browserql/firestore'

await client.query(update('Todo', increment()))
```

## last

```javascript
import { get, last } from '@browserql/firestore'

await client.query(get('Todo', last()))
```

## limit

```javascript
import { get, limit } from '@browserql/firestore'

await client.query(get('Todo', limit(25)))
```

## multiply

```javascript
import { update, multiply } from '@browserql/firestore'

await client.query(update('Todo', multiply(0.5)))
```

## orderBy

```javascript
import { get, orderBy } from '@browserql/firestore'

await client.query(get('Todo', orderBy('priority')))
```

## page

```javascript
import { get, limit, page } from '@browserql/firestore'

await client.query(get('Todo', limit(100), page(5)))
```

## remove

```javascript
import { remove, where } from '@browserql/firestore'

await client.query(remove('Todo', where('done').equals(true)))
```

## set

```javascript
import { update, set } from '@browserql/firestore'

await client.query(update('Todo', set('done').to(false)))
```

## where

```javascript
import { get, where } from '@browserql/firestore'

await client.query(get('Todo', where('done').equals(true)))
```
