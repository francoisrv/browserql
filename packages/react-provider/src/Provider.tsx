import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import Context from './Context'

interface ProviderProps {
  client: any
}

const Provider: React.FC<React.PropsWithChildren<ProviderProps>> = props => {
  const { client } = props
  console.log(1)
  return (
    <ApolloProvider client={ client.apollo }>
      <Context.Provider value={ client }>
        { props.children }
      </Context.Provider>
    </ApolloProvider>
  )
}

export default React.memo(Provider)