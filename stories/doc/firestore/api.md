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

```js
import { firestoreql, where } from '@browserql/firestore'
```

```js
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

```ts
export interface FirestoreWhere {
  field: string
  operator: FirestoreGetOperator
  value: any
}
```

```ts
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

```js
import { FirestoreGetOperator } from '@browserql/firestore'
```

```js
const fieldQuery = {
  field: 'name',
  operator: FirestoreGetOperator.equals,
  value: 'buy milk',
}
```

You can use the `where` function as a vanilla syntax:

```js
import { where } from '@browserql/firestore'

const fieldQuery = where('name')
  .equals('buy milk')
```

## Ordering

## Pagination

## Get

```ts
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

### Get By id

```js
await client.query(firestoreql.get('Todo', '1234'))
```

```js
await client.query(firestoreql.get('Todo', { id: '1234' }))
```

## Add

```js
await client.mutate(firestoreql.addOne('Todo', { name: 'buy milk' }))
```

## Udpate one

## Delete
