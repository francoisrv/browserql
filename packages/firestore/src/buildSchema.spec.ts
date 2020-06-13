import { Schema } from '@browserql/client'
import gql from 'graphql-tag'
import buildSchema, { buildWhereArg } from './buildSchema'

describe('Build schema', () => {
  const source = gql`
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
  const schema = new Schema(source)
  buildSchema(schema)
  console.log(schema.toString())
  
  describe('Directives', () => {
    it('should be have a firestore directive', () => {
      const directive = schema.getDirective('firestore')
      // @ts-ignore
      expect(Schema.getName(directive)).toEqual('firestore')
    })
  })

  describe('Build where arg', () => {
    it('should build String', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'title')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('title: FirestoreInputWhereString')
    })

    it('should build ID', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'id')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('id: FirestoreInputWhereID')
    })

    it('should build Int', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'score')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('score: FirestoreInputWhereInt')
    })

    it('should build Float', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'float')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('float: FirestoreInputWhereFloat')
    })

    it('should build Boolean', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'admin')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('admin: FirestoreInputWhereBoolean')
    })

    it('should build type', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'bar')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('bar: FirestoreInputWhereBar')
      const input = schema.getInput('FirestoreInputWhereBar')
      expect(input).toHaveProperty('kind', 'InputObjectTypeDefinition')
    })

    it('should build enumeration', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'size')
      const str = buildWhereArg(field, schema)
      expect(str).toEqual('size: FirestoreInputWhereEnum')
    })
  })
})
