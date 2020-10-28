import { ApolloProvider } from '@apollo/client'
import connect from '@browserql/client'
import { Schemaql, SchemaqlFactory } from '@browserql/types'
import { DocumentNode } from 'graphql'
import React from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import BrowserqlContext from '../contexts/BrowserqlContext'

interface Props {
  client?: any
  schema?: DocumentNode | string
  extensions?: Array<Schemaql | SchemaqlFactory>
  queries?: Schemaql['queries']
  mutations?: Schemaql['mutations']
  directives?: Schemaql['directives']
  scalars?: Schemaql['scalars']
}

function BrowserqlProviderError(props: FallbackProps) {
  const { error } = props
  return (
    <div>
      <h1>BrowerqlProvider Error: {error?.message}</h1>
      <pre>{error?.stack}</pre>
    </div>
  )
}

export default function BrowserqlProvider(
  props: React.PropsWithChildren<Props>
) {
  let { client } = props
  try {
    if (!client) {
      const connectors: Array<Schemaql | SchemaqlFactory> = []
      if (props.schema) {
        connectors.push({ schema: props.schema })
      }
      if (props.extensions) {
        connectors.push(...props.extensions)
      }
      client = connect(...connectors, {
        queries: props.queries,
        mutations: props.mutations,
        directives: props.directives,
        scalars: props.scalars,
      })
    }
  } catch (error) {
    return (
      <BrowserqlProviderError error={error} resetErrorBoundary={() => {}} />
    )
  }

  return (
    <ErrorBoundary FallbackComponent={BrowserqlProviderError}>
      <ApolloProvider client={client.apollo}>
        <BrowserqlContext.Provider value={client}>
          {props.children}
        </BrowserqlContext.Provider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}
