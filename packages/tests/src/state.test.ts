import gql from 'graphql-tag'
import connect from '@browserql/client'
import { connectState, stateql } from '@browserql/state'
import { DocumentNode, print } from 'graphql'

test('it should ok?', () => {
  const schema = gql`
    type Foo {
      id: ID
    }
  `
  const ql = connect({ schema })
  console.log(print(ql.schema))

  console.log(stateql(ql.schema as DocumentNode).get('Foo.id')(ql.cache))
})
