import type { Dictionary, Resolved } from '.'

import gql from 'graphql-tag'
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

interface V {
  int: number
}

type GetInt = Resolved<V>

const resolved = resolve<{ getInt: GetInt }>(schema)

test('it should execute query', async () => {
  const r = resolved.Query.getInt({ int: 1 })
  expect(r).toHaveProperty('query')
  expect(r).toHaveProperty('variables', { int: 1 })
})
