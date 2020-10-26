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

test('it should get array values', () => {
  const values = fp(
    gql`
      directive @foo(
        id: ID
        bar: [Bar]
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
          bar: [{
            id: 1234
            z: {
              id: 1234
            }
          }]
        )
      }
    `
  )(
    getType('Foo'),
    getField('bar'),
    getDirective('foo'),
    getValues
  )

  expect(values).toEqual({
    id: '1234',
    bar: [{
      id: '1234',
      z: { id: '1234' },
    }]
  })
})

test('bug #1', () => {
  const schema = gql`
    input Update {
      query:      String !
      variables:  JSON
      with:       String !
    }

    directive @update(
      updates: [Update]
    ) on FIELD_DEFINITION

    type Query {
      foo: ID @update(
        updates: [
          {
            query: "getCustomerQueue"
            variables: {
              cid: "variables.cid"
            }
            data: "data.queue"
          }
          {
            query: "getCustomerOrderHistory"
            variables: {
              cid: "variables.cid"
            }
            data: "data.orderHistory"
          }
        ]
      )
    }
  `
  const values = fp(schema)(
    getQuery('foo'),
    getDirective('update'),
    getValues,
  )
  console.log(values)
})
