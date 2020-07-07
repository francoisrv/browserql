import gql from 'graphql-tag'
import { Schema } from '.'
import createFragments from './createFragments'

describe('Create fragments', () => {
  const schema = new Schema(gql`
  type Foo {
    id: ID
    name: String
    score: Int
  }

  type Bar {
    id: ID
    foo: Foo
  }
  `)
  beforeAll(() => {
    createFragments(schema)
  })
  it('should have added fragment for Foo', () => {
    console.log(schema.toString())
  })
})
