import { connect } from 'browserql'
import fetchQL from 'browserql-fetch'
import { use} from 'browserql-fetch-react-hooks'
import gql from 'graphql-tag'
import Provider from 'browserql-react-provider'
import React from 'react'
import ReactDOM from 'react-dom'

const client = connect({
  schema: gql`
    type Book @fetch {
      title:      String !
      author:     String !
    }

    type Author @fetch {
      name:       String !
    }

    type Query {
      login(email: String! password: String!): User @graphql
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
  const users = useFetch().User.find()
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
  const [password, setPassword] = React.useState('')
  const [login, { loading, error }] = useFetch().login()
  function onSubmit() {
    login({ email, password })
  }
  return (
    <form>
      <input
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
        onClick={ onSubmit }
        disabled={ loading }
      />
      { error }
    </form>
  )
}