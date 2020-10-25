import fp from '@browserql/fp'
import gql from 'graphql-tag'

import getType from './getType'
import getField from './getField'
import getArgument from './getArgument'
import getName from './getName'
import getQuery from './getQuery'

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

  expect(getName(arg)).toEqual('lambda')
})

test('it should get query argument', () => {
  const arg = fp(
    gql`
      type Query {
        bar(lambda: ID): Boolean
      }
    `
  )(
    getQuery('bar'),
    getArgument('lambda')
  )

  expect(getName(arg)).toEqual('lambda')
})
