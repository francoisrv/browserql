import * as React from 'react'
import { Context } from '@browserql/react-provider'
import { useQuery } from '@browserql/react-hooks'

export default function useFirestore(path: string) {
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
  console.log(client.printSchema())
  function find() {
    const queryName = `firestoreFind${ path }`
    return useQuery(queryName)
  }
  
  return {
    find
  }
}