import connect from './connect'
import gql from 'graphql-tag'
import { Client, Schema } from '.'

describe('Client', () => {

  describe('Print schema', () => {
    it('should print schema', () => {
      const from = `type Query {
  ping: Boolean
}
`
      const client = connect({ schema: from })
      const source = client.printSchema()
      expect(source).toEqual(`${ from }
scalar JSON

scalar JSONObject
`)
    })
  })

  describe('Get schema', () => {
    it('should get schema', () => {
      const source = `type Query { pong: Boolean }`
      const client = connect({ schema: source })
      const schema = client.getSchema()
      expect(schema instanceof Schema).toBe(true)
    })
  })

  describe('Query resolver', () => {
    describe('Cache access', () => {
      const client = connect({
        schema: gql`
        type Query {
          foo: String
        }
        `
      })
      it('should return null if cache is empty', () => {
        expect(client.query('foo')).toBe(null)
      })
      it('should return the cache if cache not empty', () => {
        client.write('foo', 'hello')
        expect(client.query('foo')).toEqual('hello')
      })
    })
  })

  describe('Default values', () => {
    const client = connect({
      schema: gql`
      type Query {
        string: String
        nonNullString: String!
        int: Int
        nonNullInt: Int!
        float: Float
        nonNullFloat: Float!
        boolean: Boolean
        nonNullBoolean: Boolean!
        id: ID
        nonNullID: ID!
        array: [ String ]
        nonNullArray: [ String ]!
      }
      `
    })

    interface DefaultValueTest {
      type: string
      nonNull: any
    }

    function makeTest(t: DefaultValueTest) {
      it(`should return null when ${ t.type }`, () => {
        expect(client.query(t.type.toLowerCase())).toBe(null)
      })
      it(`should return ${ JSON.stringify(t.nonNull) } when ${ t.type }!`, () => {
        expect(client.query(`nonNull${ t.type }`)).toEqual(t.nonNull)
      })
    }

    const tests: DefaultValueTest[] = [
      { type: 'String', nonNull: '' },
      { type: 'ID', nonNull: '' },
      { type: 'Int', nonNull: 0 },
      { type: 'Float', nonNull: 0 },
      { type: 'Boolean', nonNull: false },
      { type: 'Array', nonNull: [] },
    ]

    for (const t of tests) {
      makeTest(t)
    }
  })

  describe('Read query', () => {
    it('should read query if in cache', async () => {
      const schema = gql`
      type Query { foo(bar: String!): String! }
      `
      const client = connect({ schema })
      client.apollo.writeQuery({
        query: gql`
        query($bar: String!) {
          foo(bar: $bar)
        }
        `,
        variables: { bar: 'joe' },
        data: {
          foo: 'hello joe'
        }
      })
      const data = client.readQuery('foo', { bar: 'joe' })
      expect(data).toEqual('hello joe')
    })
    it('should throw if query not in cache', async () => {
      const schema = gql`
      type Query { foolz(bar: String!): String! }
      `
      const client = connect({ schema })
      let failed = false
      try {
        client.readQuery('foolz', { bar: 'joe' })
      } catch (error) {
        failed = true
      }
      expect(failed).toBe(true)
    })
  })

  describe('Read', () => {
    it('should return cache content if any', async () => {
      const schema = gql`
      type Query { blues(bar: String!): String! }
      `
      const client = connect({ schema })
      client.apollo.writeQuery({
        query: gql`
        query($bar: String!) {
          blues(bar: $bar)
        }
        `,
        variables: { bar: 'joe' },
        data: {
          blues: 'hello joe'
        }
      })
      const data = client.read('blues', { bar: 'joe' })
      expect(data).toEqual('hello joe')
    })
    it('should return null if cache is empty', async () => {
      const schema = gql`
      type Query { bus(bar: String!): String }
      `
      const client = connect({ schema })
      const data = client.read('bus', { bar: 'joe' })
      expect(data).toEqual(null)
    })
    it('should return default value if cache is empty', async () => {
      const schema = gql`
      type Query { car(bar: String!): String! }
      `
      const client = connect({ schema })
      const data = client.read('car', { bar: 'joe' })
      expect(data).toEqual('')
    })
  })

  describe('Get query', () => {
    it('should get query', () => {
      const schema = gql`
      type Query {
        canada: String
      }
      `
      const client = connect({ schema })
      const query = client.getQuery('canada')
      expect(query).toHaveProperty('kind', 'Document')
    })
  })

  describe('Query', () => {

  })

  describe('write', () => {
    
  })

})
