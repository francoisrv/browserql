import gql from 'graphql-tag'

export default function add<D = any>(...documents: D[]) {
  return {
    mutation: gql`
      mutation A {
        a {
          
        }
      }
    `,
  }
}
