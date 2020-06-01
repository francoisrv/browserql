browserql-fetch
===

## Abstract

By adding the directive `@fetch` to a type, this type will be automatically ready for http requests

```js
import { connect } from 'browserql'
import fetchQL from 'browserql-fetch'
import gql from 'graphql-tag'

const client = connect({
  schema: gql`
    type User @fetch {
      email: String!
      verified: Boolean!
    }
  `,
  plugins: [
    fetchQL({
      base: 'https://api.com/v1'
    })
  ]
})

const { User } = client.plugins.fetchQL.models

// GET https://api.com/v1/users
const { error, loading, value } = User.get()

// GET https://api.com/v1/users/1234
const { value } = User.get('1234')

// GET https://api.com/v1/users?verified
const { value } = User.get({ verified: true })

// POST https://api.com/v1/users { email: 'a@b.c', verified: false }
const { value } = User.post({ email: 'a@b.c', verified: false })
```
