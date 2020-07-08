import gql from 'graphql-tag'
import { Schema } from '.'
import createFragments from './createFragments'
import { FieldNode } from 'graphql'

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
    const fragment = schema.fragments.getFragment('browserqlFragment_Foo')
    expect(fragment).not.toBeUndefined()
    if (fragment) {
      expect(Schema.getName(fragment.typeCondition)).toEqual('Foo')
      expect(fragment.selectionSet.selections).toHaveLength(3)
      expect(Schema.getName(fragment.selectionSet.selections[0])).toEqual('id')
      expect(Schema.getName(fragment.selectionSet.selections[1])).toEqual('name')
      expect(Schema.getName(fragment.selectionSet.selections[2])).toEqual('score')
    }
  })
  it('should have added fragment for Bar', () => {
    const fragment = schema.fragments.getFragment('browserqlFragment_Bar')
    expect(fragment).not.toBeUndefined()
    if (fragment) {
      expect(Schema.getName(fragment.typeCondition)).toEqual('Bar')
      expect(fragment.selectionSet.selections).toHaveLength(2)
      expect(Schema.getName(fragment.selectionSet.selections[0])).toEqual('id')
      expect(Schema.getName(fragment.selectionSet.selections[1])).toEqual('foo')
      const section1 = fragment.selectionSet.selections[1] as FieldNode
      // @ts-ignore
      expect(section1.selectionSet.selections).toHaveLength(1)
      expect(
        // @ts-ignore
        section1.selectionSet.selections[0]
      ).toHaveProperty('kind', 'FragmentSpread')
      expect(
        // @ts-ignore
        section1.selectionSet.selections[0].name
      ).toHaveProperty('value', 'browserqlFragment_Foo')
    }
  })
})
