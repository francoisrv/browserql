import { useQuery as useApolloQuery } from '@apollo/react-hooks'
import { Context } from '@browserql/react-provider'
import React from 'react'

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
  return useApolloQuery(query, { variables })
}
