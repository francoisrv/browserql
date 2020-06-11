import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import Context from './Context'

interface ProviderProps {
  client: any
}

const Provider: React.FC<ProviderProps> = props => {
  const { client } = props
  return (
    <ApolloProvider client={ client.apollo }>
      <Context.Provider value={ client }>
        { props.children }
      </Context.Provider>
    </ApolloProvider>
  )
}

export default React.memo(Provider)