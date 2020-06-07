import { buildSchema as ggqlBuildSchema, DocumentNode } from 'graphql'
import buildSchema from '../buildSchema'

describe('Schema', () => {
  const source = `
  type Query { foo: ID }
  type Foo @firestore {
    name: String!
  }
  `
  let schema
  let next: DocumentNode
  beforeAll(() => {
    schema = ggqlBuildSchema(source, { assumeValid: true })
    next = buildSchema(schema)
  })
  it('should have a firestore directive', () => {
    const [directive] = next.definitions
    expect(directive.kind).toEqual('DirectiveDefinition')
    expect(directive.name.value).toEqual('firestore')
    expect(directive.locations.find(loc => loc.value === 'OBJECT')).not.toBeUndefined()
    expect(directive.locations).toHaveLength(1)
    expect(directive.repeatable).toEqual(false)
    expect(directive.arguments).toHaveLength(1)
    expect(directive.arguments[0]).toHaveProperty('kind', 'InputValueDefinition')
    expect(directive.arguments[0].name).toHaveProperty('value', 'collection')
    expect(directive.arguments[0].type.name).toHaveProperty('value', 'String')
  })
  it('should have a query type', () => {
    const [,query] = next.definitions
    console.log(query)
    expect(query.kind).toEqual('ObjectTypeExtension')
    expect(query.name.value).toEqual('Query')
  })
})