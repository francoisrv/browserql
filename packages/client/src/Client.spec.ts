import connect from './connect'
import gql from 'graphql-tag'

describe('Client', () => {

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

})
