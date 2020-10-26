import gql from 'graphql-tag'
import generatets from './generatets'

test('it should write typescript', () => {
  const schema = gql`
    type Foo {
      a: ID
      b: String
      c: Int
      d: Float!
      e: Date!
      f: [ID]
      g: [ID]!
      h: [ID!]!
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

    type Mutation {
      foo: ID!
      bar(g: String, f: [Int]!): Foo
    }

    input MyInput {
      id: ID
    }

    enum Cool {
      up
      down
    }
  `
  console.log(generatets(schema))
})
