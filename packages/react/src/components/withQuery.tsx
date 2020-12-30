import type { DocumentNode } from 'graphql'
import type { ComponentType, ReactElement } from 'react'

import { useQuery } from '@apollo/client'
import React from 'react'

export default function withQuery<V, P>(
  query: DocumentNode,
  variables?: V,
) {
  return (Component: ComponentType<P>) => (props: P) => {
    const { data, error, loading } = useQuery(query, {
      variables,
    })
    const queries = getExecutableQueries(query)
    const extraProps = {}
    if (error) {
      
    }
    if (loading) {
      if (options.renderLoading) {
        return options.renderLoading
      }
      return <></>
    }
    if (!data) {
      if (options.renderError) {
        return <options.renderError error={new Error('Missing data')} />
      }
      return <></>
    }
    const keys = Object.keys(data)
    if (!keys.length) {
      if (options.renderError) {
        return <options.renderError error={new Error('Data is empty')} />
      }
      return <></>
    }
    if (keys.length === 1) {
      const response = data[keys[0]]
      return <Component {{ ...props }} />
    }
  }
}
