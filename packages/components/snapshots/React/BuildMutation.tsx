import * as React from 'react'
import gql from 'graphql-tag'
import { BrowserqlProvider } from '@browserql/react'

export default function BuildMutationExample() {
  const schema = gql`
    type User {
      email: String!
    }
    type Query {
      getUsers: [User]
    }
    type Mutation {
      addUser(email: String!):
    }
  `
  const mutation = gql`
    mutation AddUser($email: String!) {
      addUser(email: $email) {
        ...UserFragment
      }
    }
  `
  // function AddUser() {
  //   return (
  //     <BuildMutation mutation={mutation}>
  //       {({ get, isRequired, call, loading, error }) => (
  //         <form onSubmit={call}>
  //           <input
  //             type="email"
  //             required={isRequired('email')}
  //             value={get('email')}
  //             onChange={(e) => set('email', e.target.value)}
  //           />
  //         </form>
  //       )}
  //     </BuildMutation>
  //   )
  // }
  return <BrowserqlProvider schema={schema}></BrowserqlProvider>
}
