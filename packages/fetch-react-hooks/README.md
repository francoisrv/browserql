browserql-fetch-react-hooks
===

React hooks for the `browserql-fetch` plugin

## Define your schema

```js
import { connect } from 'browserql'
import fetchQL from 'browserql-fetch'
import { useFetch } from 'browserql-fetch-react-hooks'
import gql from 'graphql-tag'
import { ApolloProvider } from 'react-apollo'
import React from 'react'
import ReactDOM from 'react-dom'

const client = connect({
  schema: gql`
    type User {
      id:       ID !
      email:    String !
    }

    type Query {
      login(
        email:      String !
        password:   String !
      ): User
      @fetch(post: "https://api.com/v1/login")
    }
  `,
  plugins: [fetchQL()]
})

ReactDOM.render(
  <ApolloProvider client={ client.apollo }>
    <Login />
  </ApolloProvider>,
  document.getElementById('root')
)

function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  
  const [login, { loading, error }] = useFetch().login()
  
  function onSubmit() {
    login({ email, password })
  }
  
  return (
    <form>
      <input
        type="email"
        value={ email }
        onChange={ e => setEmail(e.target.value) }
      />
      <input
        type="password"
        value={ password }
        onChange={ e => setPassword(e.target.value) }
      />
      <input
        type="submit"
        value="LOGIN"
        onClick={ onSubmit }
        disabled={ loading }
      />
      { error }
    </form>
  )
}
```
