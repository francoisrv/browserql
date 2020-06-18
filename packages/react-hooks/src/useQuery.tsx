import { Context } from '@browserql/react-provider'
import React from 'react'

export default function useQuery<T extends any>(queryName: string, variables?: any): T {
  const contextClient = React.useContext(Context)
  if (!contextClient) {
    throw new Error('No client found')
  }
  const client = contextClient
  return client.query(queryName, variables)
}
