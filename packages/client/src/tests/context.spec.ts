import gql from "graphql-tag"
import connect from "../connect"

test('it should use context', async () => {
  const schema = gql`
  extend type Query {
    greet: String!
  }
  `

  const queries = {
    async greet(variables: any, context: any) {
      console.log({variables})
      return `Hello ${context.foo}`
    }
  }

  const context = { foo: 'bar' }

  const client = connect(
    { schema, queries, context },
    () => ({ context: { bar: 1 }})
  )

  expect(client).toHaveProperty('context')

  expect(client.context).toHaveProperty('foo', 'bar')

  const { data } = await client.apollo.query({
    query: gql`query { greet }`,
  })

  expect(data.greet).toEqual('Hello bar')

  expect(client.context).toHaveProperty('browserqlClient')

  expect(client.context).toHaveProperty('bar', 1)
})
