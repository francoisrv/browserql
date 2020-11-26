# Firestoreql

Use GraphQL with Firestore directly in your front-end apps

# Example

First define your model:

```graphql
# defs.graphql
type Todo @firestore {
  name: String!
  done: Boolean! @default(value: false)
  doneTime: FirestoreTimestamp
}
```

Create your firebase app:

```javascript
// db.js
import firebase from 'firebase/app'
import 'firebase/firestore'
```

You can now generate your executable GraphQL schema

```javascript
import { buildFirestoreql } from '@browserql/firestore'
import defs from './defs.graphql'
import db from './db'

const { schema, queries, mutations } = buildFirestoreql(db, defs)
```

Connect it to Apollo

```javascript
import ApolloClient from '@apollo/client'

const client = new ApolloClient({
  typeDefs: [schema],
  resolvers: {
    Query: queries,
    Mutation: mutations
  }
})
```

Or to browserql

```javascript
import connect from '@browserql/client'
import { connectFirestoreql } from '@browserql/firestore'

const { client } = connect(connectFirestoreql(db, defs))
```

That's it! You can now use `firestoreql` to construct your queries and mutations

```javascript
import { firestoreql, where } from '@browserql/firestore'

await client.query(firestoreql.paginate('Todo', {
  where: [
    where('done').equals(true),
    where('doneTime').isLesserThan(new Date())
  ]
}))
await client.mutate(firestoreql.addOne('Todo', { name: 'Buy milk' }))
```
