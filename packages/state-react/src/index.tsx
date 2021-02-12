import {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react'
import type { DocumentNode } from 'graphql'
import cacheql from '@browserql/cache'

interface StateObject<Variables, Data> {
  get(variables: Variables): Data
  set(
    variables: Variables | Data | ((input: Data) => Data),
    next?: Data | ((input: Data) => Data)
  ): void
}

interface Props<Variables, Data> {
  query: DocumentNode
  variables?: any
  children: (state: StateObject<Variables, Data>) => ReactElement
  cache: any
  schema: DocumentNode
}

export default function State<Variables, Data>({
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
  return children({
    get(variables) {
      return cached.get(query, variables)
    },
    set(variables, setter) {
      cached.set(query, variables, setter)
    },
  })
}
