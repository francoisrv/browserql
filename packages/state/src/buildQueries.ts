import { State } from './types'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import { Client, ClientContext, Schema, Query } from '@browserql/client'
import { Dictionary } from 'lodash'

export default function buildQueries(state: State, schema: Schema, queries: Dictionary<Query>, getClient: any) {
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`
      queries[queryName] = new Query(queryName, getClient).push((opt: any, getClient: () => Client) => {
        const client = getClient()
        try {
          const result = client.readQuery(queryName)
          return result.data[queryName]
        } catch (error) {
          client.write(queryName, state[type][field].value)
        }
        return state[type][field].value
      })
    }
  }
}
