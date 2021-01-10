import React, { ReactElement } from 'react'
import type { DocumentNode } from 'graphql'
import {
  LazyQueryResult,
  QueryResult,
  useLazyQuery,
  useQuery,
} from '@apollo/client'

type UseQueryRenderer<Data = any, Variables = any> = (
  data: Data,
  result: QueryResult<Data, Variables>
) => React.ReactElement

type UseQueryEachRenderer<D = any> = (
  item: D,
  index: number,
  data: D[],
  loading: boolean,
  error: Error | undefined
) => ReactElement

type UseQueryProps<D = any, V = any> = {
  dontRenderError?: boolean
  dontRenderLoading?: boolean
  query: DocumentNode
  queryProps?: Parameters<typeof useQuery>[1]
  renderEach?: UseQueryEachRenderer<D>
  renderEmpty?: ReactElement
  renderError?: ReactElement | ((e: Error) => ReactElement)
  renderLoading?: ReactElement
  renderNull?: ReactElement
  variables?: V
}

type UseNonLazyQueryProps<Data = any> = {
  lazy?: false
  children: UseQueryRenderer<Data>
}

type UseLazyQueryProps<Data = any, Variables = any> = {
  lazy: true
  children(
    get: (v: Variables) => void,
    result: LazyQueryResult<Data, Variables>
  ): ReactElement
}

export default function UseQuery<Data = any, Variables = any>(
  props: UseQueryProps<Data> &
    (UseNonLazyQueryProps<Data> | UseLazyQueryProps<Data, Variables>)
) {
  try {
    if (!props.query) {
    }

    if (props.lazy === true) {
      const [get, tuple] = useLazyQuery<Data, Variables>(props.query)

      if (tuple.error) {
        throw tuple.error
      }

      if (tuple.loading && props.renderLoading) {
        return props.renderLoading
      }

      return props.children(get, tuple)
    }

    const tuple = useQuery<Data, Variables>(props.query, {
      variables: props.variables,
    })

    if (tuple.error) {
      throw tuple.error
    }

    if (tuple.loading && props.renderLoading) {
      return props.renderLoading
    }

    return props.children(tuple.data as Data, tuple)
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

UseQuery.defaultProps = {
  lazy: false,
}
