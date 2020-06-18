import source from './schema.sample'
import { Schema } from '@browserql/client'
import { buildWhereArgument } from './buildWhereArgument'

describe('Build where argument', () => {
  const schema = new Schema(source)

  describe('Build where arg', () => {
    it('should build String', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'title')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('title: FirestoreInputWhereString')
    })

    it('should build ID', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'id')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('id: FirestoreInputWhereID')
    })

    it('should build Int', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'score')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('score: FirestoreInputWhereInt')
    })

    it('should build Float', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'float')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('float: FirestoreInputWhereFloat')
    })

    it('should build Boolean', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'admin')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('admin: FirestoreInputWhereBoolean')
    })

    it('should build type', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'bar')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('bar: FirestoreInputWhereBar')
      const input = schema.getInput('FirestoreInputWhereBar')
      expect(input).toHaveProperty('kind', 'InputObjectTypeDefinition')
    })

    it('should build enumeration', () => {
      const fields = schema.getTypeFields('Foo')
      const field = fields.find((f: any) => Schema.getName(f) === 'size')
      const str = buildWhereArgument(field, schema)
      expect(str).toEqual('size: FirestoreInputWhereEnum')
    })
  })
})