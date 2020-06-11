@browserql/firestore
===

firestore plugin for browserql

## Usage

```js
import connect from '@browserql/client'
import firestore from '@browserql/firestore'
import gql from 'graphql-tools'
import * as firebase from 'firebase/app'

firebase.initializeApp(firebaseConfig)

const schema = gql`
type Author     @firestore {
  name:         String!
}

type Book       @firestore {
  name:         String!
  author:       ID!         @rel(type: "Author")
}
`
const client = connect({
  schema,
  plugins: [
    firestore()
  ]
})

const db = firestore(client)

const books = await db.Book.find({
  where: { author: 'Victor Hugo' },
  paging: { page: 1, rowsPerPage: 5 },
  sort: [{ key: 'name', asc: true }],
  populate: true
})
```

## Plugins

- [firestore-react-hooks](https://npmjs.com/browserql/firestore-react-hooks) React hooks