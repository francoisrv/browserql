import { setNonNullInitialState, setInitialState } from './setInitialState'
import { Schema } from '@browserql/client'

interface Spec { type: string, value: any }

const nonNullSpecs: Spec[] = [
  { type: 'String!', value: '' },
  { type: 'Int!', value: 0 },
  { type: 'Float!', value: 0 },
  { type: 'Boolean!', value: true },

  { type: '[String]!', value: [] },
  { type: '[Int]!', value: [] },
  { type: '[Float]!', value: [] },
  { type: '[Boolean]!', value: [] },
]

const nullSpecs: Spec[] = [
  { type: 'String', value: '' },
  { type: 'Int', value: 0 },
  { type: 'Float', value: 0 },
  { type: 'Boolean', value: true },
  
  { type: '[String]', value: [] },
  { type: '[Int]', value: [] },
  { type: '[Float]', value: [] },
  { type: '[Boolean]', value: [] },

  { type: '[String!]', value: [] },
  { type: '[Int!]', value: [] },
  { type: '[Float!]', value: [] },
  { type: '[Boolean!]', value: [] },
]

const specs: Spec[] = [
  ...nonNullSpecs,
  ...nullSpecs
]

describe('Set initial state', () => {
  describe('Set non-null initial state', () => {
    for (const spec of specs) {
      it(`${ spec.type } = ${ JSON.stringify(spec.value) }`, () => {
        const schema = new Schema(`
        type Foo { bar: ${ spec.type } }
        `)
        const [bar] = schema.getTypeFields('Foo')
        const ret = setNonNullInitialState(bar.type)
        expect(ret).toEqual(spec.value)
      })
    }
  })
  describe('Set initial state', () => {
    for (const spec of nonNullSpecs) {
      it(`${ spec.type } = ${ JSON.stringify(spec.value) }`, () => {
        const schema = new Schema(`
        type Foo { bar: ${ spec.type } }
        `)
        const [bar] = schema.getTypeFields('Foo')
        const ret = setInitialState(bar.type)
        expect(ret).toEqual(spec.value)
      })
    }

    for (const spec of nullSpecs) {
      it(`${ spec.type } = ${ JSON.stringify(spec.value) }`, () => {
        const schema = new Schema(`
        type Foo { bar: ${ spec.type } }
        `)
        const [bar] = schema.getTypeFields('Foo')
        const ret = setInitialState(bar.type)
        expect(ret).toEqual(null)
      })
    }
  })
})