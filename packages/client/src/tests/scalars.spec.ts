import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'

import connect from '../connect'

const schema = gql`
  scalar JSON

  type Object {
    json: JSON
  }

  extend type Query {
    getObject: Object
  }
`

const { client } = connect({
  schema,
  scalars: {
    JSON: GraphQLJSON,
  },
  queries: {
    getObject() {
      return { json: [1, 2] }
    },
  },
})

test('it should get scalars', async () => {
  const { data } = await client.query({
    query: gql`
      query {
        getObject {
          json
        }
      }
    `,
  })
  expect(data.getObject).toEqual({
    __typename: 'Object',
    json: [1, 2],
  })
})
