import fp from '@browserql/fp'
import gql from 'graphql-tag'

import getType from './getType'
import getField from './getField'
import getArguments from './getArguments'
import getName from './getName'
import getQuery from './getQuery'

test('it should get field arguments', () => {
  const args = fp(
    gql`
      type Foo {
        bar(lambda: ID): Boolean
      }
    `
  )(
    getType('Foo'),
    getField('bar'),
    getArguments,
  )

  expect(args).toHaveLength(1)
  expect(getName(args[0])).toEqual('lambda')
})

test('it should get query argument', () => {
  const args = fp(
    gql`
      type Query {
        bar(lambda: ID): Boolean
      }
    `
  )(
    getQuery('bar'),
    getArguments
  )

  expect(args).toHaveLength(1)
  expect(getName(args[0])).toEqual('lambda')
})
