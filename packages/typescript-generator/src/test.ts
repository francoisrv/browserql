import gql from 'graphql-tag'
import generateTypescript from '.'

test('it should write typescript', () => {
  const schema = gql`
  type Foo {
    a: ID
    b: String
    c: Int
    d: Float !
    e: Date !
    f: [ ID ]
    g: [ ID ] !
    h: [ ID ! ] !
    bar: Bar
    bars: [Bar]
  }

  type Bar {
    a: ID
  }

  extend type Bar {
    b: ID
  }

  type Query {
    foo: ID!
    bar(g: String, f: [Int]!): Foo
  }
  `
  console.log(generateTypescript(schema))
})