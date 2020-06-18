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
      browserQLDefaultPlugin()({ schema, queries: {} })
      const directive = schema.getDirective('default')
      expect(directive).not.toBeUndefined()
    })
  })
  describe('Queries', () => {
    it('should return default value', () => {
      const client = connect({
        schema: gql`
        type Query {
          getCounter(foo: String): Int
          @default(value: 100)
        }
        `,
        plugins: [browserQLDefaultPlugin()]
      })
      const data = client.read('getCounter')
      console.log(data)
    })
  })
})
