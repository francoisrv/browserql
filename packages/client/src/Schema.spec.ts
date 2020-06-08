import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import Schema from './Schema'

type It = (schema: Schema) => (
  () => void | Promise<void>
)

function describeSchema(
  label: string,
  source: DocumentNode,
  ...specs: [string, It][]
) {
  describe(label, () => {
    let schema: Schema
    beforeAll(() => {
      schema = new Schema(source)
    })
    for (const [itLabel, itFn] of specs) {
      it(itLabel, async () => itFn(schema)())
    }
  })
}

describe('Schema', () => {
  describeSchema(
    'it should print schema',
    gql`type Foo { id: ID }`,
    ['should print schema', schema => () => {
      const str = schema.toString()
      expect(str.trim()).toEqual(`type Foo {
  id: ID
}`)
    }]
  )

  describeSchema(
    'it should print schema with directives',
    gql`type Foo @foo { id: ID }`,
    ['should print schema', schema => () => {
      const str = schema.toString()
      expect(str.trim()).toEqual(`type Foo @foo {
  id: ID
}`)
    }]
  )

  describeSchema(
    'it should get types',
    gql`type Foo @foo { id: ID } type Bar { id: ID! }`,
    ['should print schema', schema => () => {
      const types = schema.getTypes()
      expect(types).toHaveLength(2)
    }]
  )

  describeSchema(
    'it should get types with directive',
    gql`type Foo @foo { id: ID } type Bar { id: ID! }`,
    ['should print schema', schema => () => {
      const types = schema.getTypesWithDirective('foo')
      expect(types).toHaveLength(1)
    }]
  )

  describeSchema(
    'it should get query if any',
    gql`type Query { foo: ID }`,
    ['should print schema', schema => () => {
      const queries = schema.getQueries()
      expect(queries).toHaveLength(1)
    }]
  )

  describeSchema(
    'it should return empty if no queries',
    gql`type Foo { foo: ID }`,
    ['should print schema', schema => () => {
      const queries = schema.getQueries()
      expect(queries).toHaveLength(0)
    }]
  )

  describeSchema(
    'it should add query',
    gql`type Foo { foo: ID }`,
    ['should print schema', schema => () => {
      schema.addQuery({
        name: 'bar',
        kind: 'String'
      })
    }]
  )

  describeSchema(
    'it should extend query',
    gql`type Query { foo: ID }`,
    ['should print schema', schema => () => {
      schema.addQuery({
        name: 'bar',
        kind: '[String]!'
      })
    }]
  )

  describeSchema(
    'it should add directive',
    gql`type Foo @foo { id: ID }`,
    ['should print schema', schema => () => {
      schema.addDirective({
        name: 'foo',
        locations: { type: true },
        arguments: [
          {
            name: 'bar',
            kind: 'ID'
          }
        ]
      })
      console.log(schema.toString())
    }]
  )
})