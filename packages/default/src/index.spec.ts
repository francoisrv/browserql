import connect, { Schema } from "@browserql/client"
import gql from 'graphql-tag'
import browserQLDefaultPlugin from "."

describe('Default', () => {
  describe('Schema', () => {
    it('should add the directive', () => {
      const schema = new Schema(gql`
      type Query {
        counter: Int @default(value: 100)
      }
      `)
      // @ts-ignore
      browserQLDefaultPlugin()({ schema, queries: {} })
      const directive = schema.getDirective('default')
      expect(directive).not.toBeUndefined()
    })
  })
  describe('Queries', () => {
    it('should return default value on empty cache', () => {
      const client = connect({
        schema: gql`
        type Query {
          getCounter: Int
          @default(value: 100)
        }
        `,
        plugins: [browserQLDefaultPlugin()]
      })
      const data = client.read('getCounter')
      expect(data).toEqual(100)
    })
    it('should return default value on null', () => {
      const client = connect({
        schema: gql`
        type Query {
          getVersion: String
          @default(value: "1.0.0")
        }
        `,
        plugins: [browserQLDefaultPlugin()]
      })
      client.write('getVersion', null)
      const data = client.read('getVersion')
      expect(data).toEqual('1.0.0')
    })
    it('should *not* return default when value not null', () => {
      const client = connect({
        schema: gql`
        type Query {
          getAnotherVersion: String
          @default(value: "1.0.0")
        }
        `,
        plugins: [browserQLDefaultPlugin()]
      })
      client.write('getAnotherVersion', '2.1.0')
      const data = client.read('getAnotherVersion')
      expect(data).toEqual('2.1.0')
    })
  })
})
