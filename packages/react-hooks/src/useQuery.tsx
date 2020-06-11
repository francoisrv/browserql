import { useQuery as useApolloQuery } from '@apollo/react-hooks'
import { Context } from '@browserql/react-provider'
import React from 'react'
import get from 'lodash.get'

export default function useQuery(queryName: string, variables?: any) {
  const contextClient = React.useContext(Context)
  if (!contextClient) {
    return [
      undefined,
      {
        error: new Error('No client found')
      }
    ]
  }
  const client = contextClient
  const query = client.getQuery(queryName)
  const { data, error, loading } = useApolloQuery(query, { variables })
  return [
    get(data, queryName),
    { data, error, loading }
  ]
}
