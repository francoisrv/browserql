import { getType } from '@browserql/fpql'
import gql from 'graphql-tag'
import { print } from 'graphql'
import type { ObjectTypeExtensionNode } from 'graphql'
import transformTypeToInput from './transformTypeToInput'
import transformTypesToInputs from './transformTypesToInputs'

test('it should create input', () => {
  const schema = gql`
    type A {
      id: ID
      ids: [ID]
      b: B
    }
    type B {
      id: [[String]!]!
    }
  `
  const A = getType('A')(schema)
  const input = print(
    transformTypeToInput(A as ObjectTypeExtensionNode, schema)
  )
  expect(input).toMatch(/input AInput/)
  expect(input).toMatch(/b: BInput/)
})

test('it should create inputs', () => {
  const schema = gql`
    type A {
      id: ID
      ids: [ID]
      b: B
    }
    type B {
      id: [[String]!]!
    }
  `
  const input = print(transformTypesToInputs(schema))
  expect(input).toMatch(/input AInput/)
  expect(input).toMatch(/input BInput/)
  expect(input).toMatch(/b: BInput/)
})
