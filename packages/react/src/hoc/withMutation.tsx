import type { DocumentNode } from 'graphql'
import React, { ComponentType } from 'react'
import { Z_UNKNOWN } from 'zlib'
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

export default function withMutation<
  PROPS,
  DATA = unknown,
  VARIABLES = unknown
>(name: string | TemplateStringsArray) {
  return (mutation: DocumentNode) => (
    Component: ComponentType<
      PROPS & WithMutationProps<typeof name, DATA, VARIABLES>
    >
  ) => (props: PROPS) => (
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
