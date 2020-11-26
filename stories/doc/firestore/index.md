# Firestoreql

Use GraphQL with Firestore directly in your front-end apps

# Example

First define your model:

```graphql
# defs.graphql

type Todo @firestore {
  name: String!
}
```

Then generate it:

```js
import { buildSchema, firestoreql } from '@browserql/firestore'
import defs from './defs.graphql'

const { schema, queries, mutations } = buildSchema(db, defs)

const client = new ApolloClient({
  typeDefs: [schema],
  resolvers: {
    Query: { ...queries },
    Mutation: { ...mutations },
  },
})

await client.query(firestoreql.paginate('Todo'))
await client.mutate(firestoreql.addOne('Todo', { name: 'Buy milk' }))
```
