import { State } from './types'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import { Client, ClientContext, Schema, Resolver } from '@browserql/client'

export default function buildResolvers(state: State, schema: Schema, rootValue: any, getClient: any) {
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

      rootValue[queryName] = new Resolver(queryName, getClient).push(async (opt: any, getClient: () => Client) => {
        const client = getClient()
        try {
          const result = client.readQuery(queryName)
          return result.data[queryName]
        } catch (error) {
          client.writeQuery(queryName, state[type][field].value)
        }
        return state[type][field].value
      })

      rootValue[`set${ name }`] = new Resolver(`set${ name }`, getClient).push(async (opt: { value: any }, getClient: () => Client) => {
        const client = getClient()
        client.writeQuery(queryName, opt.value)
        return opt.value
      })

      rootValue[`toggle${ name }`] = new Resolver(`toggle${ name }`, getClient).push(async (_opt: AnalyserNode, getClient: () => Client) => {
        const client = getClient()
        const value = getValue(client)
        client.writeQuery(queryName, !value)
        return !value
      })
    }
  }
}
