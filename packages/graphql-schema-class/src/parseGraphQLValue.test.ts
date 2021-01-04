import { parseKind } from '@browserql/fpql'
import gql from 'graphql-tag'
import parseGraphQLValue from './parseGraphqlValue'

function testScalar(name: string, value: any, expected: any) {
  const parsed = parseKind(name)
  expect(
    parseGraphQLValue(
      value,
      parsed,
      gql`
        scalar ${parsed.type}
        type X {
          bar: ${parsed.type}
        }

        type Foo {
          a: String!
          bar: Bar
        }

        type Bar {
          b: Int!
        }
      `
    )
  ).toEqual(expected)
}

const tests: [string, any, any][] = [
  ['String', 'hello', 'hello'],
  ['Int', 22, 22],
  ['Float', 1.99, 1.99],
  ['Boolean', true, true],
  ['ID', 4546, '4546'],
  ['[String]', ['456'], ['456']],
  ['Foo', { a: 'hello' }, { a: 'hello', bar: null }],
  // ['EmailAddress', 'test@test.com', 'test@test.com'],
]

tests.forEach(([kind, value, expected]) => {
  test(`parseGraphQLValue(${JSON.stringify(
    value
  )}, "${kind}") > ${JSON.stringify(expected)}`, () => {
    testScalar(kind, value, expected)
  })
})
