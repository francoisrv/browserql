# Firestore

You can use [Firestore](https://firebase.google.com/products/firestore) in conjunction with `browserql`

## Schema

Use the `@firestore` directive to mark a type as a firestore collection:

```graphql
type Player @firestore {
  name: String!
  team: Team! @rel(collection: "Team")
  score: Int!
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
import { plugin as FirestorePlugin, connect as FirestoreConnect } from '@browserql/firestore'

// initialize your firestore app with firestore
firebase.initializeApp(config)
const firestore = firebase.firestore()

// create a browserql client
const client = connect({
  plugins: [FirestorePlugin(firestore)]
  schema,
})
```

## Interact with data

You can now interact with your firestore databases the same way you would with [firestore](https://firebase.google.com/docs/firestore?authuser=0):

```js
const db = await FirestoreConnect(client, firestore)

// Get players
const players = await db.collection('Player')
  .orderBy('team')
  .where('score', '>=', 1000)
  .startAt(100)
  .endAt(200)
  .get()

// Get player by id
const player = await db.collection('Player').doc(playerId).get()

// Insert new player
await db.collection('Player').set({
  name: 'player123',
  team: (await db.collection('Team').fineOne({ name: 'Red team' })).id
})
```
