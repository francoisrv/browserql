import type { DocumentNode } from 'graphql'
import React, { ComponentType } from 'react'
import { UseMutation } from '..'

type HOCMutationProps<T extends string, D = unknown> = Record<
  T,
  {
    execute: any
    loading: boolean
    error: Error | undefined
    data: D
  }
>

export default function withMutation<P>(name: string) {
  return (mutation: DocumentNode) => (
    Component: ComponentType<P & HOCMutationProps<typeof name>>
  ) => (props: P) => (
    <UseMutation mutation={mutation}>
      {(mutate, { loading, error, data }) => (
        <Component
          {...{
            ...props,
            [name]: {
              execute: mutate,
              loading,
              error,
              data,
            },
          }}
        />
      )}
    </UseMutation>
  )
}
