import { useQuery as useApolloQuery } from '@apollo/react-hooks'
import { Context } from '@browserql/react-provider'
import React from 'react'
import get from 'lodash.get'

export default function useQuery<T extends any>(queryName: string, variables?: any): [
  T | undefined,
  {
    loading: boolean
    error?: Error
  }
] {
  const contextClient = React.useContext(Context)
  if (!contextClient) {
    return [
      undefined,
      {
        loading: false,
        error: new Error('No client found')
      }
    ]
  }
  const client = contextClient
  const query = client.getQuery(queryName)
  if (!query) {
    return [
      undefined,
      {
        loading: false,
        error: new Error(`No such query: ${ queryName }`)
      }
    ]
  }
  const { data, error, loading } = useApolloQuery<T>(query, { variables })
  return [
    get(data, queryName),
    { error, loading }
  ]
}
