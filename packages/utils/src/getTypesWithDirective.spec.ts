import gql from 'graphql-tag'
import { buildASTSchema } from 'graphql'
import getTypesWithDirective from './getTypesWithDirective'
import getName from './getName'

describe('Get types with directive', () => {
  it('should find types with given directives', () => {
    const source = gql`
    directive @a on OBJECT
    directive @b on OBJECT
    type A @a {
      id: ID
    }
    type B @b {
      id: ID!
    }
    type C @b {
      id: ID!
    }
    `
    const schema = buildASTSchema(source)
    const types = getTypesWithDirective(schema, 'b')
    expect(types).toHaveLength(2)
    expect(getName(types[0])).toEqual('B')
    expect(getName(types[1])).toEqual('C')
  })
})