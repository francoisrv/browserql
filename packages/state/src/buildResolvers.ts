import { State } from './types'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import { Client, ClientContext, Schema, Resolver } from '@browserql/client'

export default function buildResolvers(state: State, schema: Schema, rootValue: any, getClient: any) {
  const resolvers: any = {}
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`

      const getValue = (client: Client) => {
        try {
          const result = client.readQuery(queryName)
          return result.data[queryName]
        } catch (error) {
          return state[type][field].value
        }
      }

      resolvers[queryName] = new Resolver(queryName, getClient).push(async (opt: any) => {
        console.log({opt})
        return false
        // const client = context.getBrowserQLClient()
        // try {
        //   const result = client.readQuery(queryName)
        //   return result.data[queryName]
        // } catch (error) {
        //   client.writeQuery(queryName, state[type][field].value)
        // }
        // return state[type][field].value
      })
      
      resolvers[`set${ name }`] = (client: Client) => ({ value }: { value: any }, context: ClientContext) => {
        const client = context.getBrowserQLClient()
        client.writeQuery(queryName, value)
        return value
      }

      resolvers[`toggle${ name }`] = (client: Client) => (_a: any, context: ClientContext) => {
        console.log(0)
        const client = context.getBrowserQLClient()
        console.log(1, client)
        const value = !getValue(client)
        console.log(2, value, queryName)
        client.writeQuery(queryName, value)
        return value
      }
    }
  }
}
