import gql from 'graphql-tag'
import describeClient from './describeClient'

const SIMPLE_SCHEMA = `
type Query {
  hello: String
}
`

describe('Client', () => {
  describeClient(
    'should print schema',
    {
      schema: gql(SIMPLE_SCHEMA)
    },
    ['should be ok', client => {
      expect(client.printSchema().trim()).toEqual(SIMPLE_SCHEMA.trim())
    }]
  )
})