import gql from 'graphql-tag'
import connect from '@browserql/client'
import resolve from '@browserql/resolved'

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

const { client, schema: finalSchema } = connect({ schema }, connectHttp())

const resolved = resolve(finalSchema)

test('it should get http', async () => {
  globalThis.fetchResponse = [
    { id: 1, title: 'Todo1' },
    { id: 2, title: 'Todo2' },
    { id: 3, title: 'Todo3' },
    { id: 4, title: 'Todo4' },
    { id: 5, title: 'Todo5' },
  ]
  const response = await client.query(resolved.Query.getTodos())
  console.log(response)
})
