import { Schema } from '@browserql/client'
import buildSchema from './buildSchema'
import source from './schema.sample'
import { isEmpty, Dictionary, find } from 'lodash'

const inputs: Dictionary<Dictionary<string>> = {
  FirestorePaging: {
    page: 'Int',
    rowsPerPage: 'Int'
  }
}

describe('Build schema', () => {
  const schema = new Schema(source)
  buildSchema(schema)
  console.log(schema.toString())
  
  describe('Directives', () => {
    it('should be have a firestore directive', () => {
      const directive = schema.getDirective('firestore')
      if (!directive) {
        throw new Error('Could not find directive declaration firestore')
      }
      expect(Schema.getName(directive)).toEqual('firestore')
    })
    it('should be have a rel directive', () => {
      const directive = schema.getDirective('rel')
      if (!directive) {
        throw new Error('Could not find directive declaration rel')
      }
      expect(Schema.getName(directive)).toEqual('rel')
    })

    for (const inputName in inputs) {
      it(`should have a ${ inputName } input`, () => {
        const input = schema.getInput(inputName)
        expect(input).not.toBeUndefined()
      })
      if (!isEmpty(inputs[inputName])) {
        const input = schema.getInput(inputName)
        if (!input) {
          throw new Error(`Unknown input ${ inputName }`)
        }
      }
    }
  })
})
