import { useQuery } from '@apollo/client'
import { BrowserqlContext } from '@browserql/react'
import resolve from '@browserql/resolved'
import React from 'react'

enum QueryOperator {
  equals = '=='
}

interface Query {
  field: string
  value: any
  operator: QueryOperator
}

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

export function where(field: string) {
  return {
    equals(value: any): Query {
      return {
        field,
        value,
        operator: QueryOperator.equals,
      }
    }
  }
}
