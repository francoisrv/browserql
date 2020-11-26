# Firestoreql API

- [Paginate](/paginate)
- [Where](/paginate)
- [Get](/paginate)
- [Add](/paginate)
- [Update](/paginate)
- [Delete](/paginate)

For the documentation and unless told otherwise, we'll use this schema as a reference:

```graphql
type Todo @firestore {
  name: String!
  done: Date @default(date: "now")
  priority: Int!
}
```

## Paginate

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
import { firestoreql, where } from '@browserql/firestore'

const data = await client.query(
  firestoreql.paginate('Todo', {
    where: [
      where('name').equals('buy milk'),
      where('priority').isLesserThan(5),
    ],
    limit: 10,
  })
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
import { FirestoreGetOperator as Operator } from '@browserql/firestore'

const fieldQuery = {
  field: 'name',
  operator: Operator.equals,
  value: 'buy milk',
}
```

You can use the `where` function as a vanilla syntax:

```javascript
import { where } from '@browserql/firestore'

const fieldQuery = where('name').equals('buy milk')
```

## Ordering

## Pagination

## Get

```typescript
firestoreql.get(
  typeName:   string

  asc?:       boolean
  id?:        string
  ids?:       string[]
  orderBy?:   string
  where?:     Where | Where[]
  page?:      number
)
```

### Get where

```javascript
await client.query(
  firestoreql.get('Todo', {
    where: [
      where('name').equals('Buy milk'),
      where('priority').isLesserThanOrEqualTo(5),
    ],
  })
)
```

### Get By id

```javascript
await client.query(firestoreql.get('Todo', '1234'))
```

```javascript
await client.query(firestoreql.get('Todo', { id: '1234' }))
```

### Get By ids

```javascript
await client.query(firestoreql.get('Todo', ['1234', '4567']))
```

```javascript
await client.query(firestoreql.get('Todo', { ids: ['1234', '4567'] }))
```

## Add

```javascript
await client.mutate(firestoreql.addOne('Todo', { name: 'buy milk' }))
```

## Udpate one

## Delete
