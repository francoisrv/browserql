import type { Schemaql, SchemaqlFactory } from '@browserql/types'
import type { DocumentNode } from 'graphql'

import {
  ApolloProvider,
  FetchResult,
  useMutation,
  useQuery,
} from '@apollo/client'
import connect from '@browserql/client'
import React, { ReactNode, useState } from 'react'

interface Props {
  client?: any
  schema?: DocumentNode | string
  extensions?: Array<Schemaql | SchemaqlFactory>
  queries?: Schemaql['queries']
  mutations?: Schemaql['mutations']
  directives?: Schemaql['directives']
  scalars?: Schemaql['scalars']
}

export const BrowserqlContext = React.createContext<Schemaql>({})

export function BrowserqlProvider(props: React.PropsWithChildren<Props>) {
  let { client } = props
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

  return (
    // @ts-ignore
    <ApolloProvider client={client.apollo}>
      <BrowserqlContext.Provider value={client}>
        {props.children}
      </BrowserqlContext.Provider>
    </ApolloProvider>
  )
}

type BrowserqlQueryProps<D = any> = {
  query: DocumentNode
  variables?: any
  renderLoading?: React.ReactNode
  renderError?: React.ReactNode | ((e: Error) => React.ReactNode)
  renderNull?: React.ReactNode
  renderEmpty?: React.ReactNode
  render?: (
    data: D,
    loading: boolean,
    error: Error | undefined
  ) => React.ReactNode
  renderEach?: (
    item: D,
    index: number,
    data: D[],
    loading: boolean,
    error: Error | undefined
  ) => React.ReactNode
  dontRenderLoading?: boolean
  dontRenderError?: boolean
}

export function BrowserqlQuery<D = any>(props: BrowserqlQueryProps<D>) {
  try {
    if (!props.query) {
    }

    const { data, loading, error } = useQuery(props.query, {
      variables: props.variables,
    })

    if (error) {
      throw error
    }

    let accessor: any = null

    if (loading && props.renderLoading) {
      return props.renderLoading
    }

    if (!loading && !error && data) {
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
            {accessor.map(
              (item, index, items) =>
                props.renderEach &&
                props.renderEach(item, index, items, loading, error)
            )}
          </>
        )
      }
    }

    if ('render' in props && props.render && accessor) {
      return props.render(accessor, loading, error)
    }

    return <span />
  } catch (error) {
    if (typeof props.renderError === 'function') {
      return props.renderError(error)
    }
    if (props.renderError) {
      return props.renderError
    }
    return <span />
  }
}

interface BrowserqlMutationProps<D = any> {
  mutation: DocumentNode
  renderLoading?: ReactNode
  renderError?: ReactNode | ((e: Error) => ReactNode)
  render: (
    mutation: (options: D) => Promise<FetchResult<D>>,
    args: {
      loading: boolean
      error?: Error
      data?: D
      called: number
    }
  ) => ReactNode
}

export function BrowserqlMutation<D = any>(props: BrowserqlMutationProps<D>) {
  const [mutation, { loading, error, data }] = useMutation(props.mutation)
  const [called, setCalled] = useState(0)
  if (error && props.renderError) {
    if (typeof props.renderError === 'function') {
      return props.renderError(error)
    }
    return props.renderError
  }
  if (loading && props.renderLoading) {
    return props.renderLoading
  }
  return props.render(
    async (...args: any[]) => {
      setCalled(called + 1)
      const data = await mutation({ variables: args[0] })
      if (data.data) {
        const [key] = Object.keys(data.data)
        return { ...data.data[key as keyof typeof data.data] }
      }
      return data
    },
    { loading, error, data, called }
  )
}
