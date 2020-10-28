import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'
import { print } from 'graphql'

import connectState from './connectState'
import { getMutations, getName, getQueries } from '@browserql/fpql'

const schema1 = gql`
  type State @state {
    foo: Int!
  }
`

const schema2 = gql`
  type SecondaryState @state {
    bar: [Int]!
  }
`

const schema = connectState({ schema: schema1 })({ schema: schema2 })
// console.log(print(schema.schema))
const queries = getQueries(schema.schema as DocumentNode)
const mutations = getMutations(schema.schema as DocumentNode)

test('it should update the schema', () => {
  expect(
    queries.find((query) => getName(query) === 'state_State_foo_get')
  ).not.toBeUndefined()
  expect(
    queries.find((query) => getName(query) === 'state_SecondaryState_bar_get')
  ).not.toBeUndefined()
  expect(
    mutations.find((mutation) => getName(mutation) === 'state_State_foo_set')
  ).not.toBeUndefined()
  expect(
    mutations.find(
      (mutation) => getName(mutation) === 'state_State_foo_increment'
    )
  ).not.toBeUndefined()
  expect(
    mutations.find(
      (mutation) => getName(mutation) === 'state_SecondaryState_bar_set'
    )
  ).not.toBeUndefined()
  expect(
    mutations.find(
      (mutation) => getName(mutation) === 'state_SecondaryState_bar_increment'
    )
  ).not.toBeUndefined()
})

test('it should have the resolvers', () => {
  expect(schema.queries).toHaveProperty('state_State_foo_get')
  expect(schema.queries).toHaveProperty('state_SecondaryState_bar_get')
  expect(schema.mutations).toHaveProperty('state_State_foo_set')
  expect(schema.mutations).toHaveProperty('state_State_foo_increment')
  expect(schema.mutations).toHaveProperty('state_SecondaryState_bar_set')
  expect(schema.mutations).toHaveProperty('state_SecondaryState_bar_increment')
})

test('it should use the resolveds', () => {})
