import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import Context from './Context'
import connect, { ConnectOptions } from '@browserql/client'

interface PluginProps {
  client: any
}

type ProviderProps =
| PluginProps
| ConnectOptions

const Provider: React.FC<ProviderProps> = props => {
  let client
  if ('client' in props) {
    client = props.client
  } else {
    client = connect(props)
  }
  return (
    <ApolloProvider client={ client.apollo }>
      <Context.Provider value={ client }>
        { props.children }
      </Context.Provider>
    </ApolloProvider>
  )
}

export default Provider