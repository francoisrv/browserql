import type { DocumentNode } from 'graphql'
import React, { ComponentType } from 'react'
import { UseMutation } from '..'

type HOCMutationProps<T extends string> = Record<
  T,
  {
    execute: any
  }
>

export default function withMutation<P>(name: string) {
  return (mutation: DocumentNode) => (
    Component: ComponentType<P & HOCMutationProps<typeof name>>
  ) => (props: P) => (
    <UseMutation mutation={mutation}>
      {(mutate) => (
        <Component
          {...{
            ...props,
            [name]: {
              execute: mutate,
            },
          }}
        />
      )}
    </UseMutation>
  )
}
