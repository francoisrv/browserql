import { ApolloProvider, DocumentNode, useQuery } from '@apollo/client';
import connect, { ConnectMiddleware, ConnectOptions } from '@browserql/client';
import React from 'react';

interface Props {
  client?: any
  schema?: DocumentNode | string
  extensions?: ConnectMiddleware[]
}

export const BrowserqlContext = React.createContext({})

export function BrowserqlProvider(props: React.PropsWithChildren<Props>) {
  if (props.client) {
    return (
      <ApolloProvider client={props.client.client}>
        {props.children}
      </ApolloProvider>
    )
  }
  const connectors: Array<ConnectOptions|ConnectMiddleware> = []
  if (props.schema) {
    connectors.push({ schema: props.schema })
  }
  if (props.extensions) {
    connectors.push(...props.extensions)
  }
  const client = connect(...connectors)
  return (
    // @ts-ignore
    <ApolloProvider client={client.client}>
      <BrowserqlContext.Provider value={client}>
        {props.children}
      </BrowserqlContext.Provider>
    </ApolloProvider>
  )
}

type GraphQLProps = {
  query: DocumentNode
  variables?: any
  renderLoading?: React.ReactNode
  renderError?: React.ReactNode | ((e: Error) => React.ReactNode)
  renderNull?: React.ReactNode
  renderEmpty?: React.ReactNode
  render?: (data: any, loading: boolean, error: Error | undefined) => React.ReactNode
  renderEach?: (item: any, index: number, data: any[], loading: boolean, error: Error | undefined) => React.ReactNode
}

export function GraphQLQuery(props: GraphQLProps) {
  const { data, loading, error } = useQuery(props.query, { variables: props.variables })
  let accessor: any = null
  if (error && props.renderError) {
    if (typeof props.renderError === 'function') {
      return props.renderError(error)
    }
    return props.renderError
  }
  if (loading && props.renderLoading) {
    return props.renderLoading
  }
  if (!loading && !error && data ) {
    const [queryName] = Object.keys(data)
    accessor = data[queryName]
  }
  if (!loading && !error && data === null && props.renderNull) {
    return props.renderNull
  }
  if (Array.isArray(accessor)) {
    if (!accessor.length && props.renderEmpty) {
      return props.renderEmpty
    }
    if (props.renderEach) {
      return (
        <>
          {accessor.map((item, index, items) => props.renderEach && props.renderEach(item, index, items, loading, error))}
        </>
      )
    }
  }
  if ('render' in props && props.render && accessor) {
    return props.render(accessor, loading, error)
  }
  return <span />
}
