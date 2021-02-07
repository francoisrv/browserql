import React, { ReactElement } from 'react'
import type { DocumentNode } from 'graphql'
import cacheql from '@browserql/cache'

interface StateObject<Variables, Data> {
  get(variables: Variables): Data
  map(iterator: (item: Data) => Data): void
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
  variables,
}: Props<Variables, Data>) {
  console.log(123, cache)
  const cached = cacheql(cache, schema)
  return children({
    get(variables) {
      return cached.get(query, variables)
    },
    map(fn) {
      cached.map(query, variables, fn)
    },
  })
}
