import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import type { DocumentNode, GraphQLScalarType } from 'graphql'
import cacheql from '@browserql/cache'
import type { ApolloClient } from '@apollo/client'

interface Props<Variables, Data extends Record<string, any>> {
  query: DocumentNode
  variables?: Variables
  children: (
    data: Data,
    setter: (next: Data) => void,
    cached: ReturnType<typeof cacheql>
  ) => ReactElement
  hydrate?: ApolloClient<any> | boolean
}

export default function makeState(
  cache: any,
  schema: DocumentNode,
  options: {
    scalars?: Record<string, GraphQLScalarType>
    client?: ApolloClient<any>
  } = {}
) {
  return function State<Variables, Data extends Record<string, any>>({
    children,
    query,
    hydrate,
    variables,
  }: Props<Variables, Data>) {
    const cached = cacheql(cache, schema)
    const [op, setOp] = useState(0)
    const refresh = useCallback(() => setOp(op + 1), [op])
    const hydrateAndRefresh = useCallback(
      async (variables?: Variables) => {
        const netQuery = { query, variables }
        if (hydrate === true) {
          if ('client' in options && options.client) {
            await options.client.query(netQuery)
          }
        } else if (hydrate) {
          await hydrate.query(netQuery)
        }
      },
      [op]
    )
    useEffect(() => {
      return cache.watch({
        optimistic: true,
        query,
        variables,
        callback() {
          setTimeout(refresh)
        },
      })
    }, [query, op])
    const access = {
      get() {
        const res = cached.get(query, variables)
        if (hydrate) {
          try {
            const inCache = cache.readQuery({ query, variables })
            if (inCache === null) {
              throw new Error('Cache is null')
            }
          } catch (error) {
            hydrateAndRefresh(variables)
          }
        }
        return res
      },
      set(setter: Data) {
        cached.set(query, variables, setter)
      },
    }
    return children(access.get(), access.set, cached)
  }
}
