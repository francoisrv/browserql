import gql from 'graphql-tag'
import connect from '@browserql/client'
import connectCache from '@browserql/cache'
import { DocumentNode, print } from 'graphql'

test('it should ok?', () => {
  const schema = gql`
    extend type Query {
      id: ID
      string: String
    }
  `
  const ql = connect({ schema })
  console.log(print(ql.schema))

  const cached = connectCache(ql.cache, schema)
  const id = cached('id')
  const string = cached('string')

  expect(id.get()).toEqual(null)
  expect(string.get()).toEqual(null)

  // id.set(1234)
  string.set({ foo: 1234 })

  // expect(id.get()).toEqual('1234')

  console.log(string.get())
})
