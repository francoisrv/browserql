import gql from 'graphql-tag'
import { getName } from '..'
import hasDirective from '../lib/hasDirective'
import enhanceSchema from '../schema'

const schema = gql`
  directive @foo on FIELD_DEFINITION

  type Query {
    hello: String @foo
  }
`

const document = enhanceSchema(schema)

test('it should find query by directive', () => {
  const query = document.getQueries().find((q) => hasDirective(q, 'foo'))
  expect(getName(query)).toEqual('hello')
})
