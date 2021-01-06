import React from 'react'
import connect from '@browserql/client'
import type { DocumentNode } from 'graphql'
import type { ReactElement } from 'react'
import type { Schemaql, SchemaqlFactory } from '@browserql/types'
import { ApolloProvider } from '@apollo/client'

import BrowserqlContext from '../contexts/BrowserqlContext'

export interface BrowserqlProviderProps {
  client?: any
  schema?: DocumentNode
  extensions?: Array<Schemaql | SchemaqlFactory>
  queries?: Schemaql['queries']
  mutations?: Schemaql['mutations']
  directives?: Schemaql['directives']
  scalars?: Schemaql['scalars']
  renderError?: ReactElement | ((props: { error: Error }) => ReactElement)
}

function BrowserqlProviderError({ error }: { error: Error }) {
  return (
    <div>
      <h1>BrowerqlProvider Error</h1>
      <pre>{error?.stack}</pre>
    </div>
  )
}

export default function BrowserqlProvider(
  props: React.PropsWithChildren<BrowserqlProviderProps>
) {
  let { client, renderError } = props
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
    if (renderError) {
      if (typeof renderError === 'function') {
        return renderError({ error })
      }
      return renderError
    }
    return <BrowserqlProviderError error={error} />
  }

  return (
    <ApolloProvider client={client.apollo}>
      <BrowserqlContext.Provider value={client}>
        {props.children}
      </BrowserqlContext.Provider>
    </ApolloProvider>
  )
}
