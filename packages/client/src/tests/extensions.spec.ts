import gql from 'graphql-tag'
import resolve from '@browserql/resolved'
import connect from '../connect'
import enhanceSchema, { getName } from '@browserql/schemax'

const main = {
  schema: gql`
    type Todo {
      id: ID!
    }

    type Query {
      getTodo: Todo
    }
  `,
  queries: {
    getTodo() {
      return { id: 1 }
    },
  },
}

const extension = () => ({
  schema: gql`
    type Customer {
      id: ID!
    }

    type Query {
      getCustomer: Customer
    }
  `,
  queries: {
    getCustomer() {
      return { id: 1 }
    },
  },
})

const client = connect(main, extension)

test('it should have been extended', () => {
  expect(client).toHaveProperty('schema')
  const doc = enhanceSchema(client.schema)
  expect(getName(doc.getType('Todo'))).toEqual('Todo')
  expect(getName(doc.getType('Customer'))).toEqual('Customer')
  expect(getName(doc.getQuery('getTodo'))).toEqual('getTodo')
  expect(getName(doc.getQuery('getCustomer'))).toEqual('getCustomer')
  expect(client.queries).toHaveProperty('getTodo')
  expect(client.queries).toHaveProperty('getCustomer')
})
