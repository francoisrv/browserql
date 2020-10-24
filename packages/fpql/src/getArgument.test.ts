import fp from '@browserql/fp'
import gql from 'graphql-tag'

import getType from './getType'
import getField from './getField'
import getArgument from './getArgument'
import getName from './getName'

test('it should get field argument', () => {
  const arg = fp(
    gql`
      type Foo {
        bar(lambda: ID): Boolean
      }
    `
  )(
    getType('Foo'),
    getField('bar'),
    getArgument('lambda')
  )

  expect(getName(arg))
})