# Firestoreql API

- [Paginate](/paginate)
- [Where](/paginate)
- [Get](/paginate)
- [Add](/paginate)
- [Update](/paginate)
- [Delete](/paginate)

## Paginate

```ts
firestoreql.paginate(
  typeName:   string

  asc?:       boolean
  limit?:     number
  orderBy?:   string
  page?:      number
  where?:     Where | Where[]
)
```

### Examples

With firestoreql

```js
import { firestoreql, where } from '@browserql/firestore'

await client.query(
  firestoreql.paginate('Todo', {
    where: [where('name').equals('buy milk')],
    limit: 100,
    orderBy: 'name',
    asc: false,
    page: 10,
  })
)
```

With react components

```jsx
<Firestoreql
  paginate="Todo"
  asc={false}
  limit={100}
  orderBy="name"
  page={10}
  where={[where('name').equals('buy milk')]}
>
  {(todos) => <div />}
</Firestoreql>
```

## Where

```ts
export interface Where {
  field:    string
  operator: Operator
  value:    any
}

export enum Operator {
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

## Add

## Udpate one

## Delete
