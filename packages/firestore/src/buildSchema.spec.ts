import { Schema } from '@browserql/client'
import gql from 'graphql-tag'
import buildSchema from './buildSchema'

describe('Build schema', () => {
  const source = gql`
  type Bar {
    id: ID
    name: String
    score: Int
  }
  
  type Foo @firestore {
    title: String
    name: String!
    names: [String]
    titles: [[String]]
    id: ID
    ids: [ID!]!
    score: Int
    age: Int!
    scores: [Int]
    float: Float
    floats: [Float]
    admin: Boolean
    admins: [Boolean]
    bar: Bar
  }
  `
  const schema = new Schema(source)
  buildSchema(schema)
  console.log(schema.toString())
  
  it('should be have a firestore directive', () => {
    const directive = schema.getDirective('firestore')
    // console.log(directive)
  })
})