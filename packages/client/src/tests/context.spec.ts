import gql from "graphql-tag"
import connect from "../connect"

test('it should use context', () => {
  const schema = gql`
  extend type Query {
    greet(name: String!): String!
  }
  `

  const queries = {
    async greet(a, b) {
      console.log({a, b})
    }
  }

  const context = { foo: 'bar' }

  const client = connect({ schema, queries, context })

  expect(client).toHaveProperty('context', { foo: 'bar' })

  await client.apollo.query
})
