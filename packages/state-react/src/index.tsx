import { ReactElement, useCallback, useEffect, useState } from 'react'
import type { DocumentNode, GraphQLScalarType } from 'graphql'
import cacheql from '@browserql/cache'

interface StateObject<Data extends Record<string, any>> {
  get(): Data
  set(setter?: Data | ((input: Data) => Data)): void
}

interface Props<Variables, Data extends Record<string, any>> {
  query: DocumentNode
  variables?: any
  children: (
    state: (
      name: keyof Data,
      variables?: Variables
    ) => StateObject<Data[typeof name]>
  ) => ReactElement
  cache: any
  schema: DocumentNode
  scalars?: Record<string, GraphQLScalarType>
}

export default function State<Variables, Data extends Record<string, any>>({
  cache,
  children,
  query,
  schema,
}: Props<Variables, Data>) {
  const cached = cacheql(cache, schema)
  const [op, setOp] = useState(0)
  const refresh = useCallback(() => setOp(op + 1), [op])
  useEffect(() => {
    return cache.watch({
      optimistic: true,
      query,
      callback() {
        refresh()
      },
    })
  }, [query, op])
  return children((name: keyof Data, variables?: Variables) => ({
    get() {
      return cached.get(query, variables)[name]
    },
    set(setter) {
      cached.set(query, variables, { [name]: setter })
    },
  }))
}
