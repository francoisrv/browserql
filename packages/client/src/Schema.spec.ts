import gql from 'graphql-tag'
import Schema from './Schema'
import { printType } from 'graphql'

function indentSource(source: string, tab = '      ') {
  const lines = source.split(/\n/)
  return lines
    .map(line => line.replace(new RegExp(`^${ tab }`), ''))
    .join('\n')
}

interface ExpectTypeOptions {
  description?: string | undefined
  name?: string
}

function expectType(type: any, options: ExpectTypeOptions = {}) {
  expect(type).toHaveProperty('kind', 'ObjectTypeDefinition')
  if ('description' in options) {
    expect(type).toHaveProperty('description', options.description)
  } else {
    expect(type).toHaveProperty('description', undefined)
  }
  expect(type).toHaveProperty('name')
  expect(type.name).toHaveProperty('kind', 'Name')
  if (options.name) {
    expect(type.name).toHaveProperty('value', options.name)
  } else {
    expect(type.name).toHaveProperty('value')
  }
  expect(type).toHaveProperty('directives')
  expect(Array.isArray(type.directives)).toBe(true)
  expect(type).toHaveProperty('fields')
  expect(Array.isArray(type.fields)).toBe(true)
}

function expectTypeToHaveDirective(type: any, directive: string) {
  expect(Schema.hasDirective(type, directive)).toBe(true)
}

function expectField(field: any) {
  console.log(field)
}

describe('Schema', () => {
  describe('Print', () => {
    it('should print schema', () => {
      const source = indentSource(`type Foo {
        id: ID
      }`)
      const schema = new Schema(source)
      const str = schema.toString()
      expect(str.trim()).toEqual(source)
    })
    it('should print schema with directives', () => {
      const source = indentSource(`type Foo @foo {
        id: ID
      }`)
      const schema = new Schema(source)
      const str = schema.toString()
      expect(str.trim()).toEqual(source)
    })
  })

  describe('Types', () => {
    it('should get types', () => {
      const schema = new Schema('type Foo @foo { id: ID } type Bar { id: ID! }')
      const types = schema.getTypes()
      expect(types).toHaveLength(2)
      expectType(types[0], { name: 'Foo' })
      expectType(types[1], { name: 'Bar' })
      expectTypeToHaveDirective(types[0], 'foo')
    })
    it('should get type', () => {
      const schema = new Schema('type Foo @foo { id: ID } type Bar { id: ID! }')
      const type = schema.getType('Foo')
      expectType(type, { name: 'Foo' })
      expectTypeToHaveDirective(type, 'foo')
    })
    it('should get types with directive', () => {
      const schema = new Schema('type Foo @foo { id: ID } type Bar { id: ID! }')
      const types = schema.getTypesWithDirective('foo')
      expect(types).toHaveLength(1)
      expectType(types[0], { name: 'Foo' })
    })
    it('should get type fields', () => {
      const schema = new Schema(gql`
      type Foo {
        id: ID
      }
      extend type Foo {
        name: String
      }
      `)
      const fields = schema.getTypeFields('Foo')
      expect(fields).toHaveLength(2)
    })
  })

  describe('Queries', () => {
    it('should get query if any', () => {
      const schema = new Schema('type Query { foo: ID }')
      const queries = schema.getQueries()
      expect(queries).toHaveLength(1)
    })
    it('should return empty if no queries', () => {
      const schema = new Schema('type Foo { foo: ID }')
      const queries = schema.getQueries()
      expect(queries).toHaveLength(0)
    })
    it('should get extended queries', () => {
      const schema = new Schema(`
      type Query { foo: ID }
      extend type Query { bar: ID }
      `)
      const queries = schema.getQueries()
      expect(queries).toHaveLength(2)
    })
    it('should add query', () => {
      const schema = new Schema('type Foo { foo: ID }')
      schema.addQuery('extend type Query { bar: String }')
      const queries = schema.getQueries()
      expect(queries).toHaveLength(1)
    })
    it('should extend query', () => {
      const schema = new Schema('type Query { foo: ID }')
      schema.addQuery('extend type Query { bar: String }')
      const queries = schema.getQueries()
      expect(queries).toHaveLength(2)
    })
  })

  describe('Directives', () => {
    it('should add directive as a string', () => {
      const schema = new Schema('type Foo @foo { id: ID }')
      schema.addDirective('directive @foo on OBJECT')
    })
  })

  describe('Kinds', () => {
    it('should print kind', () => {
      const schema = new Schema(gql`
      type Foo {
        bar: [ID]!
      }
      `)
      const fields = schema.getTypeFields('Foo')
      expect(Schema.printType(fields[0].type)).toEqual('[ ID ] !')
    })
  })

  describe('Enumerations', () => {
    it('should get enumerations', () => {
      const schema = new Schema(gql`
      type Foo {
        id: ID
      }
      enum Size {
        SMALL
        MEDIUM
        LARGE
      }
      `)
      const enums = schema.getEnumerations()
      expect(enums).toHaveLength(1)
      expect(enums[0]).toHaveProperty('kind', 'EnumTypeDefinition')
      expect(Schema.getName(enums[0])).toEqual('Size')
    })
    it('should get enumeration', () => {
      const schema = new Schema(gql`
      enum Role {
        Reader
        Writer
      }
      enum Size {
        SMALL
        MEDIUM
        LARGE
      }
      `)
      const e = schema.getEnumeration('Size')
      // @ts-ignore
      expect(Schema.getName(e)).toEqual('Size')
    })
  })
})
