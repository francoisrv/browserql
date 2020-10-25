import fp from '@browserql/fp'
import gql from 'graphql-tag'

import getType from './getType'
import getField from './getField'
import getValues from './getValues'
import getName from './getName'
import getQuery from './getQuery'
import getDirective from './getDirective'

test('it should get values', () => {
  const catcher = () => []

  const values = fp(
    gql`
      directive @foo on FIELD_DEFINITION
      type Foo {
        bar(lambda: ID): Boolean @foo
      }
    `
  )(
    getType('Foo'),
    getField('bar'),
    getDirective('foo'),
    getValues
  )

  expect(values).toEqual({})
})

