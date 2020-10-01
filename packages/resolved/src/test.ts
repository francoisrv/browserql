import gql from 'graphql-tag'
import connect from '@browserql/client'
import resolve from '.'

const schema = gql`
  type Query {
    getInt(int: Int!): Int!
  }

  type Mutation {
    setInt(int: Int!): Int!
  }
`

const queries = {
  async getInt({ int }: { int: number }) {
    return int
  },
}

const mutations = {
  async setInt({ int }: { int: number }) {
    return int
  },
}

const { apollo: client } = connect({ schema, queries, mutations })

const resolved = resolve(schema)

test('it should execute query', async () => {
  const { data } = await client.query(resolved.Query.getInt({ int: 1 }))
})
