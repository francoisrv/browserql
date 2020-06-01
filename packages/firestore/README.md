browserql-firestore
===

firestore plugin for brwoserql

## Usage

```js
import { connect } from 'browserql'
import firestore from 'browserql-firestore'
import gql from 'graphql-tools'

const schema = gql`
type Book @firestore {
  chat:         ID!       @firestore(rel: "Chat" index: true)
  sender:       ID!       @firestore(rel: "User" index: true)
  message:      String!
}
`

export const { client } = connect({
  schema,
  plugins: [
    firestore()
  ]
})

const db = firestore(client)

const chat = db.create.Chat({ name: })
```