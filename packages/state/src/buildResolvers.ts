import { State } from './types'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import { Client, ClientContext } from '@browserql/client'

export default function buildResolvers(state: State) {
  const resolvers: any = {}
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`
      const mutationName = `set${ name }`
      
      resolvers[queryName] = (_a: any, context: ClientContext) => {
        const client = context.getBrowserQLClient()
        try {
          const result = client.readQuery(queryName)
          console.log({result})
        } catch (error) {
          client.writeQuery(queryName, state[type][field].value)
        }
        return state[type][field].value
      }
      
      resolvers[mutationName] = (client: Client) => ({ value }: { value: any }, context: ClientContext) => {
        const client = context.getBrowserQLClient()
        client.writeQuery(queryName, value)
        return value
      }
    }
  }
  return resolvers
}
