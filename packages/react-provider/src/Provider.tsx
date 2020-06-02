import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import Context from './Context'

interface ProviderProps {
  client: any
}

const Provider: React.FC<ProviderProps> = props => (
  <ApolloProvider client={ props.client.apollo }>
    <Context.Provider value={ props.client }>
      { props.children }
    </Context.Provider>
  </ApolloProvider>
)

export default Provider