import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import gql from 'graphql-tag'

import printType from '@browserql/utils/dist/printType'

import { State } from './types'

export default function buildSchema(state: State) {
  const queries: string[] = []
  const mutations: string[] = []
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`
      const mutationName = `set${ name }`
      const kind = printType(state[type][field].field.type)
      queries.push(`${ queryName }: ${ kind }`)
      mutations.push(`${ mutationName }(value: ${ kind }): ${ kind }`)
    }
  }
  return gql`
  directive @state on OBJECT
  scalar Any

  extend type Query {
    ${ queries.join('\n  ') }
  }

  extend type Mutation {
    ${ mutations.join('\n  ') }
  }
  `
}
