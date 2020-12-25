# Firestoreql

Use GraphQL with Firestore directly in your front-end apps

```snapshot
Firestore.Example1
```

# Usage

First define your model:

```graphql
# defs.graphql
type Todo @firestore {
  name: String!
  done: Boolean! @default(value: false)
  doneTime: FirestoreTimestamp
}
```

_Note the use of the `@firestore` directive: it means this type represents a firestore collection._

Then create your firebase app:

```javascript
// db.js
import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: 'xxx',
  projectId: 'xxx',
  appId: 'xxx',
  authDomain: 'xxx',
}

firebase.initializeApp(config)

export default firebase.firestore()
```

You can now generate your executable GraphQL schema

```javascript
import { build } from '@browserql/firestore'
import defs from './defs.graphql'
import db from './db'

const { schema, queries, mutations } = build(db, defs)
```

Connect it to browserql

```javascript
import connect from '@browserql/client'
import { connect as connectFirestoreql } from '@browserql/firestore'

const { client } = connect(connectFirestoreql(db, defs))
```

That's it! You can now use our helpers to construct your queries and mutations

```javascript
import { add, get, where, orderBy } from '@browserql/firestore'

await client.query(
  get(
    defs,
    'Todo',
    where('done').equals(true),
    where('doneTime').isLesserThan(new Date()),
    orderBy('doneTime')
  )
)

await client.mutate(add('Todo', { name: 'Buy milk' }))
```

You can also use it with react:

```javascript
import { Firestoreql } from '@browserql/firestore-react'
```

```javascript
function Todos() {
  return (
    <Firestoreql get="Todo">
      {(todos) => (
        <>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.name}</li>
            ))}
          </ul>
          <Firestoreql addOne="Todo">
            {(addOne) => (
              <button onClick={() => addOne({ name: 'buy milk' })}>Add</button>
            )}
          </Firestoreql>
        </>
      )}
    </Firestoreql>
  )
}
```
