import { useQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'
import React from 'react'

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
  queryProps?: Parameters<typeof useQuery>[1]
}

export default function BrowserqlQuery<D = any>(props: BrowserqlQueryProps<D>) {
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
