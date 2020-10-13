# Firestore

## Usage

### Schema

```graphql
type Todo @firestore {
  name: String!
  done: Boolean!
}
```

### Connect firestore with browserql

```js
import connect from 'browserql'
import connectFirestore from 'firestoreql'

import schema from './schema.graphql'

// Import your firebase config and initializer here

const client = connect(connectFirestore({ schema }))
```

### Use the firestore object

```js
import { exposeFirestore, where } from '@browserql/firestore'

const firestore = exposeFirestore(client)
```

#### Use it inside apollo via `model`

```js
await client.apollo.query(
  firestore
    .model('Todo')
    .paginate(where('done').equals(false), { size: 10, orderBy: 'name' })
)

await client.apollo.mutate(
  firestore.model('Todo').addOne({ name: 'Buy milk', done: false })
)
```

#### Use it inside resolvers via `exec`

```js
const schema = gql`
  extend type Query {
    getCurrentTodos: [Todo!]!
  }
`

const queries = {
  async getCurrentTodos() {
    return await firestore.exec.paginate('Todo', where('done').equals(false))
  },
}
```

## API

### connectFirestore

### exposeFirestore

### Utilities

`@browserql/firestore` gives you a set of utilities. You need to _expose_ them first in order to use them

```js
import connect from 'browserql'
import connectFirestore from 'firestoreql'

const client = connect(connectFirestore())
const firestore = exposeFirestore(client)
```

`firestore` is now an object with these 2 properties:

- `model()`
- `exec`

Both share the same interface (view below)

#### Model

#### Exec

### Interface

#### addMany

```js
await firestore.exec.addMany('Todo', [
  { name: 'Buy milk' },
  { name: 'Pick up laundry' },
])

await client.apollo.mutate(
  firestore
    .model('Todo')
    .addMany([{ name: 'Buy milk' }, { name: 'Pick up laundry' }])
)
```

```graphql
extend type Mutation {
  addMany([ $TypeAsAnInput ! ] !): [ $Type ! ] !
}
```

#### addOne

#### count

#### deleteById

#### deleteMany

#### deleteOne

#### getById

#### getOne

#### paginate

#### updateById

#### updateMany

#### updateOne
