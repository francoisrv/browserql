import { getType } from '@browserql/fpql'
import gql from 'graphql-tag'
import type { ObjectTypeExtensionNode } from 'graphql'
import transformTypeToInput from './transformTypeToInput'

test('it should create input', () => {
  const schema = gql`
    type Foo {
      id: ID
    }
  `
  const Foo = getType('Foo')(schema)
  const input = transformTypeToInput(Foo as ObjectTypeExtensionNode)
  console.log(input)
})
