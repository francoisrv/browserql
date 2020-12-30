import type { DocumentNode } from 'graphql'
import type { ComponentType } from 'react'
import { getExecutableQueries, getName } from '@browserql/fpql'

import { ApolloError, useQuery } from '@apollo/client'
import React from 'react'

export default function withQuery<V, P, D>(query: DocumentNode, variables?: V) {
  return (
    Component: ComponentType<
      P &
        Record<
          string,
          {
            loading: boolean
            error: undefined | ApolloError
            data: D
          }
        >
    >
  ) => (props: P) => {
    const { data, error, loading } = useQuery(query, {
      variables,
    })
    const queries = getExecutableQueries(query)
    const nextProps: Partial<
      P &
        Record<
          string,
          {
            loading: boolean
            error: undefined | ApolloError
            data: D
          }
        >
    > = {
      ...props,
    }
    queries.map(getName).map((name: string) => {
      nextProps[name as keyof typeof nextProps] = {
        loading,
        error,
        data: data ? data[name] : null,
      }
    })
    return <Component {...nextProps} />
  }
}
