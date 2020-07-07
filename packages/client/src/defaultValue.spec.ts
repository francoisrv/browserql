import defaultValue from "./defaultValue"
import gql from 'graphql-tag'

describe('Default values', () => {
  interface DefaultValueTest {
    type: string
    nonNull: any
  }

  function makeTest(t: DefaultValueTest) {
    const document = gql`
    type Foo { null: ${ t.type }, nonNull: ${ t.type }! }
    `
    // @ts-ignore
    const { fields } = document.definitions[0]
    const [ fNull, fNonNull ] = fields
    it(`should return null on ${ t.type }`, () => {
      expect(defaultValue(fNull.type)).toBe(null)
    })
    it(`should return ${ JSON.stringify(t.nonNull) } on ${ t.type }`, () => {
      expect(defaultValue(fNonNull.type)).toEqual(t.nonNull)
    })
  }

  const tests: DefaultValueTest[] = [
    { type: 'String', nonNull: '' },
    { type: 'ID', nonNull: '' },
    { type: 'Int', nonNull: 0 },
    { type: 'Float', nonNull: 0 },
    { type: 'Boolean', nonNull: false },
    { type: '[ID]', nonNull: [] },
  ]

  for (const t of tests) {
    makeTest(t)
  }
})
