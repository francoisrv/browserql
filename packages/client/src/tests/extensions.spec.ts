import gql from 'graphql-tag'

import connect from '../connect'

const main = {
  schema: gql`
    type Todo {
      id: ID! @foo
    }

    extend type Query {
      getTodo: Todo @foo
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
    directive @foo on FIELD_DEFINITION

    type Customer {
      id: ID!
    }

    extend type Query {
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
  // expect(client).toHaveProperty('schema')
  // expect(getName(getType('Todo'))).toEqual('Todo')
  // expect(getName(getType('Customer'))).toEqual('Customer')
  // expect(getName(getQuery('getTodo'))).toEqual('getTodo')
  // expect(getName(getQuery('getCustomer'))).toEqual('getCustomer')
  // expect(client.queries).toHaveProperty('getTodo')
  // expect(client.queries).toHaveProperty('getCustomer')
})

test('it should extend from empty', () => {
  // const x = connect()
})
