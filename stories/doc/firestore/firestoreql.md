# Firestoreql API

We'll use this schema as a reference:

```graphql
type Todo @firestore {
  name: String!
  done: Date @default(date: "now")
  priority: Int! @default(value: 0)
}
```

## Get

```ts
firestoreql.paginate(
  typeName:   string

  asc?:       boolean
  limit?:     number
  orderBy?:   string
  page?:      number
  where?:     FirestoreWhere[]
)
```

### Example

```javascript
import { asc, get, limit, orderBy, page, where } from '@browserql/firestore'

const data = await client.query(
  get(
    'Todo',
    where('name').equals('buy milk'),
    where('priority').isLesserThan(5),
    orderBy('priority'),
    asc(false),
    limit(100),
    page(2)
  )
)
```

## Where

Where is an array to apply conditions to the search

```typescript
export interface FirestoreWhere {
  field: string
  operator: FirestoreGetOperator
  value: any
}
```

```typescript
export enum FirestoreGetOperator {
  contains                = 'contains',
  doesNotContain          = 'doesNotContain'
  doesNotEqual            = '!=',
  equals                  = '=',
  isGreaterThan           = '>',
  isGreaterThanOrEqualTo  = '>=',
  isIn                    = 'in',
  isLesserThan            = '<',
  isLesserThanOrEqualTo   = '<=',
  isNotIn                 = 'nin',
  references              = 'references',
}
```

As you can see, an example would be:

```javascript
import { get, where } from '@browserql/firestore'

await client.query(get('Todo', where('name').equals('buy milk')))
```

## Ordering

You can specify a field as a grouper

```javascript
import { get, orderBy } from '@browserql/firestore'

await client.query(get('Todo', orderBy('name')))
```

Group will be sorted in an ascending fashion. You can used descending instead setting it to false:

```javascript
import { asc, get, orderBy } from '@browserql/firestore'

await client.query(get('Todo', orderBy('name'), asc(false)))
```

## Pagination

You can define pagination using limit and page.

The query below will return todos from 100 to 200.

```javascript
import { get, limit, page } from '@browserql/firestore'

await client.query(get('Todo', limit(100), page(2)))
```

**Note** Page is one-based, so we start at page 1, and not page 0.

## Get only one

Get first result only

```javascript
import { get, first } from '@browserql/firestore'

await client.query(get('Todo', first()))
```

Get last result only

```javascript
import { get, last } from '@browserql/firestore'

await client.query(get('Todo', last()))
```

### Get By id

```javascript
import { get, id } from '@browserql/firestore'

await client.query(get('Todo', id('1234')))
```

### Get By id

```javascript
import { get, ids } from '@browserql/firestore'

await client.query(get('Todo', ids('1234', '5678')))
```

## Add one

```javascript
import { add } from '@browserql/firestore'

await client.mutate(add('Todo', { name: 'buy milk' }))
```

## Add many

```javascript
import { add } from '@browserql/firestore'

await client.mutate(add('Todo', { name: 'buy milk' }, { name: 'fix tv' }))
```

## Udpate

```javascript
import { set, where, update } from '@browserql/firestore'

await client.mutate(
  update('Todo', set('done').to(false), where('name').equals('buy milk'))
)
```

## Increment

```javascript
import { increment, limit, update } from '@browserql/firestore'

await client.mutate(update('Todo', increment(5), limit(10)))
```

## Mulitply

```javascript
import { multiply, id, update } from '@browserql/firestore'

await client.mutate(update('Todo', multiply(2), id('1234')))
```

## Remove

```javascript
import { remove, where } from '@browserql/firestore'

await client.mutate(remove('Todo', where('name').equals('buy milk')))
```
