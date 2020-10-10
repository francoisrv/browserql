import { useQuery } from '@apollo/client'
import { BrowserqlContext } from '@browserql/react'
import resolve from '@browserql/resolved'
import React from 'react'
import { Query } from './utils'

export function useFirestore(collection: string) {
  return {
    get(...queries: Query[]) {
      const ctx = React.useContext(BrowserqlContext)
      const resolved = resolve(ctx.schema)
      const { loading, error, data } = useQuery(resolved.Query.firestorePaginate({
        collection,
        where: queries,
      }))
      return { loading, error, data: data && ('firestorePaginate' in data) ? data.firestorePaginate : undefined }
    }
  }
}
