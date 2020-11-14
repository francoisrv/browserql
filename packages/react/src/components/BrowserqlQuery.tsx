import { useQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'
import React from 'react'

type BrowserqlQueryRenderer<D = any> = (
  data: D,
  loading: boolean,
  error: Error | undefined
) => React.ReactElement

type BrowserqlQueryEachRenderer<D = any> = (
  item: D,
  index: number,
  data: D[],
  loading: boolean,
  error: Error | undefined
) => React.ReactNode

type BrowserqlQueryProps<D = any> = {
  children: BrowserqlQueryRenderer<D>
  dontRenderError?: boolean
  dontRenderLoading?: boolean
  query: DocumentNode
  queryProps?: Parameters<typeof useQuery>[1]
  renderEach?: BrowserqlQueryEachRenderer<D>
  renderEmpty?: React.ReactNode
  renderError?: React.ReactNode | ((e: Error) => React.ReactNode)
  renderLoading?: React.ReactNode
  renderNull?: React.ReactNode
  variables?: any
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

    if ('children' in props && props.children && accessor) {
      return props.children(accessor, loading, error)
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
