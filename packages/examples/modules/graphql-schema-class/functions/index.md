```graphql
input User {
  id: ID!
  email: String!
  createdAt: Timestamp! = now()
}

type Query {
  getUserById(id: ID!): User
}

type Mutation {
  saveUser(user: User!): ID!
}
```

```javascript
class User extends GraphqlSchemaClass {
  static schema = schema

  static get = queryResolver(schema, 'getUserById', ({ id }) =>
    db.find('users', { id })
  )

  static save = mutationResolver(schema, 'saveUser', ({ user }) =>
    db.update('users', user.id, user)
  )
}

const user = await User.get({ id: 2 })

user.set('email', '...')

await User.save({ user })
```
