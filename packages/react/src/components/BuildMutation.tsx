import { QueryResult } from '@apollo/client'
import type { DocumentNode } from 'graphql'
import { ReactElement, useState } from 'react'

interface Props<Variables extends Record<string, unknown>, Data = unknown> {
  mutation: DocumentNode
  children(
    props: {
      get<K extends keyof Variables>(key: K): Variables[K]
      set<K extends keyof Variables>(key: K, value: Variables[K]): void
      isRequired<K extends keyof Variables>(key: K): boolean
    } & QueryResult<Variables, Data>
  ): ReactElement
}

export default function BuildMutation<
  Variables extends Record<string, unknown>
>(props: Props<Variables>) {
  const [state, getState] = useState()
}
