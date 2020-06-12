import { Schema } from '@browserql/client'
import buildState from './buildState'

describe('Build state', () => {
  const fields: { type: string, value: any }[] = [
    { type: 'String', value: null },
    { type: 'String!', value: '' },
    { type: 'String @initialState(value: "hello")', value: 'hello' },

    { type: 'Int', value: null },
    { type: 'Int!', value: 0 },
    { type: 'Int @initialState(value: 22)', value: 22 },

    { type: 'Float', value: null },
    { type: 'Float!', value: 0 },
    { type: 'Float @initialState(value: 22)', value: 22 },

    { type: 'Boolean', value: null },
    { type: 'Boolean!', value: true },
    { type: 'Boolean @initialState(value: false)', value: false },
  ]

  const schema = new Schema(`
  type State @state {
    ${
      fields
        .map((field, index) => `f${ index }: ${ field.type }`)
        .join('\n')
    }
  }
  type Foo {
    id: ID
  }
  `)
  console.log(schema.toString())
  const state = buildState(schema, 'state')
  
  it('should have types marked', () => {
    expect(state).toHaveProperty('State')
  })

  it('should not have types unmarked', () => {
    expect(state).not.toHaveProperty('Foo')
  })

  fields.forEach((field, index) => {
    it(`f${ index }: ${ field.type } = ${ JSON.stringify(field.value) }`, () => {
      expect(state.State).toHaveProperty(`f${ index }`)
      expect(state.State[`f${ index }`]).toHaveProperty('field')
      expect(state.State[`f${ index }`].field).toHaveProperty('kind', 'FieldDefinition')
      expect(state.State[`f${ index }`].value).toEqual(field.value)
    })
  })
})