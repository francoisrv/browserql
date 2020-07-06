# Firestore

You can use [Firestore](https://firebase.google.com/products/firestore) in conjunction with `browserql`

## Schema

Use the `@firestore` directive to mark a type as a firestore collection:

```graphql
type Player @firestore {
  name: String!
  team: Team! @rel(collection: "Team")
}

type Team @firestore {
  name: String!
}
```

## browserql client

```js
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import connect from '@browserql/client'
import firestore from '@browserql/firestore'

// initialize your firestore app
firebase.initializeApp(config)

// connect to the firestore
const firestoreql = firestore(firebase.firestore())

// create a browserql client
const client = connect({
  plugins: [firestoreql.asAPlugin]
  schema,
})
```

You can now interact with your firestore databases:

```js
const db = await firestoreql.asAClient(client)

// Get players
const players = await db.collection('Player').find()

// Insert new player
await db.collection('Player').insertOne({
  name: 'player123',
  team: (await db.collection('Team').fineOne({ name: 'Red team' })).id
})
```

## API

### find

### findOne

### findById

### findByIds

### insertOne

### insertMany

### deleteOne

### deleteMany

### deleteById

### deleteByIds

### updateOne

### updateMany

### updateById

### updateByIds