import gql from 'graphql-tag'
import describeClient from './describeClient'

describe('Schema', () => {
  describeClient(
    'should accept query-less schema',
    {
      schema: gql`
      type Foo {
        id: ID!
      }
      `
    },
    ['should be ok', client => {
      
    }]
  )

  describeClient(
    'should add vanilla query if no query type',
    {
      schema: gql`
      type Foo {
        id: ID!
      }
      `
    },
    ['should be ok', client => {
      console.log(client.printSchema())
    }]
  )
})