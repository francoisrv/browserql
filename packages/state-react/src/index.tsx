import { ReactElement, useCallback, useEffect, useState } from 'react'
import type { DocumentNode, GraphQLScalarType } from 'graphql'
import cacheql from '@browserql/cache'
import type { ApolloClient } from '@apollo/client'

interface StateObject<Data extends Record<string, any>> {
  get(): Data
  set(setter?: Data | ((input: Data) => Data)): void
}

interface Props<Variables, Data extends Record<string, any>> {
  query: DocumentNode
  variables?: Variables
  children: (
    state: (
      name: keyof Data,
      variables?: Variables
    ) => StateObject<Data[typeof name]>,
    cached: ReturnType<typeof cacheql>
  ) => ReactElement
  cache: any
  schema: DocumentNode
  scalars?: Record<string, GraphQLScalarType>
  hydrate?: ApolloClient<any>
}

export default function State<Variables, Data extends Record<string, any>>({
  cache,
  children,
  query,
  schema,
  hydrate,
}: Props<Variables, Data>) {
  const cached = cacheql(cache, schema)
  const [op, setOp] = useState(0)
  const refresh = useCallback(() => setOp(op + 1), [op])
  const hydrateAndRefresh = useCallback(
    async (variables?: Variables) => {
      const netQuery = { query, variables }
      if (hydrate) {
        await hydrate.query(netQuery)
      }
    },
    [op]
  )
  useEffect(() => {
    return cache.watch({
      optimistic: true,
      query,
      callback() {
        setTimeout(refresh)
      },
    })
  }, [query, op])
  return children(
    (name: keyof Data, variables?: Variables) => ({
      get() {
        const res = cached.get(query, variables)[name]
        if (hydrate) {
          try {
            cache.readQuery({ query, variables })
          } catch (error) {
            hydrateAndRefresh(variables)
          }
        }
        return res
      },
      set(setter) {
        cached.set(query, variables, { [name]: setter })
      },
    }),
    cached
  )
}
