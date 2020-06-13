import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import gql from 'graphql-tag'
import { Schema } from '@browserql/client'
import { State } from './types'

export default function buildSchema(state: State, schema: Schema) {
  const queries: string[] = []
  const mutations: string[] = []
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`
      const mutationName = `set${ name }`
      const kind = Schema.printType(state[type][field].field.type)
      queries.push(`${ queryName }: ${ kind }`)
      mutations.push(`${ mutationName }(value: ${ kind }): ${ kind }`)
      mutations.push(`toggle${ name }: Boolean`)
    }
  }
  schema.extend(gql`
  directive @state on OBJECT
  directive @initialState(
    value: JSON
  ) on FIELD_DEFINITION
  `)
  schema.addQuery(gql`
  extend type Query {
    ${ queries.join('\n  ') }
  }
  `)
  schema.addMutation(gql`
  extend type Mutation {
    ${ mutations.join('\n  ') }
  }
  `)
}
