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
  function find(where: any) {
    const queryName = `firestoreFind${ path }`
    const queryWhere: any = {}
    for (const key in where) {
      queryWhere[key] = { equals: where[key] }
    }
    return useQuery(queryName, { where: queryWhere })
  }
  function findOne() {
    const queryName = `firestoreFindOne${ path }`
    return useQuery(queryName)
  }
  function findById(id: string) {
    const queryName = `firestoreFindById${ path }`
    return useQuery(queryName, { id })
  }
  
  return {
    find,
    findOne,
    findById
  }
}