import gql from 'graphql-tag'

export const getState = gql`
query getStateQuery(
  $state: String!
) {
  getState(
    state: $state
  )
}
`