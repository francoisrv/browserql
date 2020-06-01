import * as React from 'react'
import { ApolloProvider } from 'react-apollo'

interface BrowserQlProviderProps {
  client: any
}

const BrowserQlProvider: React.FC<BrowserQlProviderProps> = props => (
  <ApolloProvider client={ props.client }>
    { props.children }
  </ApolloProvider>
)

export default BrowserQlProvider