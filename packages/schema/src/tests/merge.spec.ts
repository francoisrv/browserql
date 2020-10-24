import gql from 'graphql-tag'
import { ObjectTypeExtensionNode, print } from 'graphql'
import { getName, getQuery, merge } from '..'
import getType from '../lib/getType'
import getField from '../lib/getField'
import { chain, flow } from 'lodash'

test('it should have extended schema', () => {
  const schema = merge(
    gql`
      type Todo {
        id: ID!
        name: String!
      }

      type Query {
        getTodo: Todo
      }
    `,
    gql`
      type Customer {
        id: ID!
        name: String!
      }

      type Todo {
        foo: ID
      }
    
      type Query {
        getCustomer: Customer
      }
    `
  )
  const queries = ['getTodo', 'getCustomer']
  queries.forEach(query => {
    expect(getName(getQuery(schema, query))).toEqual(query)
  })
  const types = ['Todo', 'Customer']
  types.forEach(type => {
    expect(getName(getType(schema, type))).toEqual(type)
  })
  const foo = flow(
    getType.fp('Todo'),
    getField.fp('foo'),
    getName
  )(schema)
  expect(foo).toEqual('foo')
})

test('it should work when 1st schema does not have a query, but the 2nd does', async () => {
  const s = merge(
    gql`
      type Foo {
        id: ID
      }
    `,
    gql`
      type Query {
        foo: ID
      }
    `
  )
  const source = print(s)
  expect(source).not.toMatch('extend type Query')
})

test('it should remove duplicate entries', () => {
  const s = merge(
    gql`
      type Foo {
        id: ID!
      }
    `,
    gql`
      type Foo {
        id: ID!
      }
    `
  )
  console.log(print(s))
})
