import { State } from './types'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import { Client, Schema, Mutation } from '@browserql/client'
import { Dictionary } from 'lodash'

export default function buildMutations(state: State, schema: Schema, mutations: Dictionary<Mutation>, getClient: any) {
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`

      const getValue = (client: Client) => {
        try {
          const result = client.readQuery(queryName)
          return result[queryName]
        } catch (error) {
          return state[type][field].value
        }
      }

      mutations[`set${ name }`] = new Mutation(`set${ name }`, getClient).push(async (opt: { value: any }, getClient: () => Client) => {
        const client = getClient()
        client.write(queryName, opt.value)
        return opt.value
      })

      mutations[`toggle${ name }`] = new Mutation(`toggle${ name }`, getClient).push(async (_opt: any, getClient: () => Client) => {
        const client = getClient()
        const value = getValue(client)
        client.write(queryName, !value)
        return !value
      })
    }
  }
}
