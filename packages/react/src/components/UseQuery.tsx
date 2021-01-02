import React from 'react'
import type { DocumentNode } from 'graphql'
import { useQuery } from '@apollo/client'

type UseQueryRenderer<D = any> = (
  data: D,
  extra: {
    loading: boolean
    error: Error | undefined
  }
) => React.ReactElement

type UseQueryEachRenderer<D = any> = (
  item: D,
  index: number,
  data: D[],
  loading: boolean,
  error: Error | undefined
) => React.ReactNode

type UseQueryProps<D = any> = {
  children: UseQueryRenderer<D>
  dontRenderError?: boolean
  dontRenderLoading?: boolean
  query: DocumentNode
  queryProps?: Parameters<typeof useQuery>[1]
  renderEach?: UseQueryEachRenderer<D>
  renderEmpty?: React.ReactNode
  renderError?: React.ReactNode | ((e: Error) => React.ReactNode)
  renderLoading?: React.ReactNode
  renderNull?: React.ReactNode
  variables?: any
}

export default function UseQuery<D = any>(props: UseQueryProps<D>) {
  try {
    if (!props.query) {
    }

    const { data, loading, error } = useQuery(props.query, {
      variables: props.variables,
    })

    if (error) {
      throw error
    }

    let accessor: any = undefined

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
    const [queryName] = Object.keys(data)

    if (
      'children' in props &&
      props.children &&
      typeof accessor !== 'undefined'
    ) {
      return props.children(data, { loading, error })
    }

    return null
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
