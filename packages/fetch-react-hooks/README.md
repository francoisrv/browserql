browserql-fetch-react-hooks
===

React hooks for the `browserql-fetch` plugin

## Define your schema

```graphql
type User @fetch {

}
```

```js
import { connect } from 'browserql'
import fetchQL from 'browserql-fetch'
import { use} from 'browserql-fetch-react-hooks'
import gql from 'graphql-tag'
import Provider from 'browserql-react-provider'
import React from 'react'
import ReactDOM from 'react-dom'

const client = connect({
  schema: gql`
    type User @fetch {
      id: ID!
      email: String!
      verified: Boolean!
    }
  `,
  plugins: [
    fetchQL({ base: 'https://api.com/v1' })
  ]
})

ReactDOM.render(
  <Provider client={ client }>
    <App />
  </Provider>,
  document.getElementById('root')
)

function App() {
  return (
    <>
      <Users />
      <CreateUserForm />
    </>
  )
}

function Users() {
  const users = useFetchQL(client).User.get()
  if (users.error) {
    return <span>{ users.error }</span>
  }
  if (users.loading) {
    return <span>Loading</span>
  }
  return (
    <div>
      <h1>Users</h1>
      <ul>
      {
        users.data.map(user => (
          <li key={ user.id }>
            { user.email }
          </li>
        ))
      }
      </ul>
    </div>
  )
}

function CreateUserForm() {
  const [email, setEmail] = React.useState('')
  const [createUser, { loading, error }] = useFetchQL(client).User.post
  return (
    <form>
      <input
        value={ email }
        setValue={ e => setEmail(e.target.value) }
      />
      <input
        type="submit"
        onClick={ () => createUser({ email }) }
        disabled={ loading }
      />
      { error }
    </form>
  )
}
```
