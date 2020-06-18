import gql from 'graphql-tag'

export default gql`
type Bar {
  id: ID
  name: String
  score: Int
}

enum Size {
  SMALL
  MEDIUM
  LARGE
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
  size: Size
}
`
