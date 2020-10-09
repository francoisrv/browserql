import { print } from 'graphql'
import gql from 'graphql-tag'
import { getName } from '..'
import enhanceSchema from '../schema'

const schema1 = gql`
  type Todo {
    id: ID!
    name: String!
  }

  type Query {
    getTodo: Todo
  }
`

const schema2 = gql`
  type Customer {
    id: ID!
    name: String!
  }

  type Query {
    getCustomer: Customer
  }
`

const schema = enhanceSchema(schema1)

schema.extend(schema2)

test('it should have extended schema', () => {
  const query = schema.getQuery('getCustomer')
  expect(getName(query)).toEqual('getCustomer')
})

test('it should work when 1st schema does not have a query, but the 2nd does', async () => {
  const s = enhanceSchema(
    gql`
      type Foo {
        id: ID
      }
    `
  )
  s.extend(
    gql`
      type Query {
        foo: ID
      }
    `
  )
  const source = s.print()
  expect(source).not.toMatch('extend type Query')
})
