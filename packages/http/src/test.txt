import gql from 'graphql-tag'
import connect from '@browserql/client'
import resolve from '@browserql/resolved'
import enhanceSchema from '@browserql/schema'

import './fetch-test'
import connectHttp from '.'

const schema = gql`
  type Todo {
    id: ID!
    title: String!
  }

  type Query {
    getTodos: [Todo!]! @httpGet(url: "/todos")
  }
`

const { client, schema: finalSchema, queries, mutations } = connect(
  { schema },
  connectHttp()
)

const resolved = resolve<any>(finalSchema)

test('it should have a query resolver for getTodo', () => {
  expect(queries).toHaveProperty('getTodos')
})

test('it should get http', async () => {
  const expected = [
    { id: '1', title: 'Todo1', __typename: 'Todo' },
    { id: '2', title: 'Todo2', __typename: 'Todo' },
    { id: '3', title: 'Todo3', __typename: 'Todo' },
    { id: '4', title: 'Todo4', __typename: 'Todo' },
    { id: '5', title: 'Todo5', __typename: 'Todo' },
  ]
  globalThis.fetchResponse = [...expected]
  const response = await client.query(resolved.Query.getTodos())
  expect(response.data.getTodos).toEqual(expected)
})
