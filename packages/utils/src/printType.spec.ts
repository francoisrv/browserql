import gql from 'graphql-tag'

describe('Print type', () => {
  const schema = gql`
  type Query {
    foo: ID
  }
  `
})