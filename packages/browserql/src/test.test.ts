import gql from 'graphql-tag'
import connect from './connect'
import Client from './Client'

describe('Resolvers', () => {
  const schema = gql`
  type Query {
    foo: String
    hello(name: String): String
  }

  type Mutation {
    a1: Int!
    a2(foo: Int!): Int!
  }
  `
  const resolvers = {
    foo: () => 'bar',
    hello: ({ name }: any) => `hello ${ name }`,
    a1: () => 42,
    a2: (o: any) => o.foo
  }
  let client: Client

  beforeAll(() => {
    client = connect({ schema, resolvers })
  })

  it('should apply query resolver', async () => {
    const results = await client.query('foo')
    expect(results.data).toHaveProperty('foo', 'bar')
  })

  it('should apply query resolver with variables', async () => {
    const results = await client.query('hello', { name: 'joy' })
    expect(results.data).toHaveProperty('hello', 'hello joy')
  })

  it('should apply mutation resolver', async () => {
    const results = await client.mutate('a1')
    expect(results.data).toHaveProperty('a1', 42)
  })

  it('should apply mutation resolver with variables', async () => {
    const results = await client.mutate('a2', { foo: 22 })
    expect(results.data).toHaveProperty('a2', 22)
  })
})
