import type { DocumentNode } from 'graphql'
import React, { ComponentType } from 'react'
import { UseMutation } from '..'

interface HOCMutation<DATA, VARIABLES> {
  execute: (v: VARIABLES) => DATA
  loading: boolean
  error: Error | undefined
  data: DATA
}

type HOCMutationProps<
  PROP_NAME extends string,
  DATA = unknown,
  VARIABLES = unknown
> = Record<PROP_NAME, HOCMutation<DATA, VARIABLES>>

export type WithMutationProps<
  PROP_NAME extends string,
  DATA = unknown,
  VARIABLES = unknown
> = { [P in PROP_NAME]: HOCMutation<DATA, VARIABLES> }

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
