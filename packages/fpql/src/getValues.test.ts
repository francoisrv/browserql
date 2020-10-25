import fp from '@browserql/fp'
import gql from 'graphql-tag'

import getType from './getType'
import getField from './getField'
import getValues from './getValues'
import getName from './getName'
import getQuery from './getQuery'
import getDirective from './getDirective'

test('it should get empty values', () => {
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

test('it should get object values', () => {
  const values = fp(
    gql`
      directive @foo(
        id: ID
        bar: Bar
      ) on FIELD_DEFINITION
      type Bar {
        id: ID
        z: Z
      }
      type Z {
        id: ID
      }
      type Foo {
        bar(lambda: ID): Boolean @foo(
          id: 1234
          bar: {
            id: 1234
            z: {
              id: 1234
            }
          }
        )
      }
    `
  )(
    getType('Foo'),
    getField('bar'),
    getDirective('foo'),
    getValues
  )

  expect(values).toEqual({ id: '1234', bar: { id: '1234', z: { id: '1234' } } })
})

