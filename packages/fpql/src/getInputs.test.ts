import gql from 'graphql-tag'
import getInputs from './getInputs'
import getName from './getName'

test('it should get input', () => {
  const inputs = getInputs(gql`
    input Foo {
      id: ID
    }
  `)
  expect(inputs).toHaveLength(1)
  expect(getName(inputs[0])).toEqual('Foo')
})
