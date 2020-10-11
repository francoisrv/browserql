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

// console.log(schema.print())

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

test('it should remove duplicate entries', () => {
  const s = enhanceSchema(
    gql`
      type Foo {
        id: ID!
      }
    `
  )
  s.extend(
    gql`
      type Foo {
        id: ID!
      }
    `
  )
  console.log(s.print())
})

test.only('ttttttt', () => {
  const s1 = gql`
  type Foo { a: ID }
  `
  const s2 = gql`
  type Query { a: ID }
  `
  
});
