import { State } from './types'
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
import { Client } from '@browserql/client'

export default function buildResolvers(state: State) {
  const resolvers: any = {}
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`
      const mutationName = `set${ name }`
      
      resolvers[queryName] = (client: Client) => () => {
        try {
          const result = client.readQuery(queryName)
          console.log({result})
        } catch (error) {
          client.writeQuery(queryName, state[type][field].value)
        }
        return state[type][field].value
      }
      
      resolvers[mutationName] = (client: Client) => ({ value }: { value: any }) => {
        client.writeQuery(queryName, value)
        return value
      }
    }
  }
  return resolvers
}
