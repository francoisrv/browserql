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
          client.writeQuery('foo', 'hello')
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
          nonNullInt: Int!
          nonNullFloat: Float!
          nonNullBoolean: Boolean!
          nonNullID: ID!
        }
        `
      })
      it('should return null when String', () => {
        expect(client.query('string')).toBe(null)
      })
      it('should return "" when String!', () => {
        expect(client.query('nonNullString')).toBe('')
      })
      it('should return 0 when Int!', () => {
        expect(client.query('nonNullInt')).toEqual(0)
      })
      it('should return 0 when Float!', () => {
        expect(client.query('nonNullFloat')).toEqual(0)
      })
      it('should return false when Boolean!', () => {
        expect(client.query('nonNullBoolean')).toBe(false)
      })
      it('should return null when ID', () => {
        expect(client.query('nonNullID')).toBe('')
      })
    })

})