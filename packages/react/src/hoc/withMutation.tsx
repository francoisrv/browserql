// import type { DocumentNode } from 'graphql'
// import React, { ComponentType } from 'react'
// import { Z_UNKNOWN } from 'zlib'
// import { UseMutation } from '..'

// interface HOCMutation<DATA, VARIABLES> {
//   execute: (v: VARIABLES) => DATA
//   loading: boolean
//   error: Error | undefined
//   data: DATA
// }

// export type WithMutationProps<
//   PROP_NAME extends string,
//   DATA = unknown,
//   VARIABLES = unknown
// > = { [P in PROP_NAME]: HOCMutation<DATA, VARIABLES> }

// export default function withMutation<NAME extends string>(name: NAME) {
//   return function <PROPS = unknown, DATA = unknown, VARIABLES = unknown>(
//     mutation: DocumentNode
//   ) {
//     return function (
//       Component: ComponentType<PROPS & WithMutationProps<NAME, DATA, VARIABLES>>
//     ) {
//       return function (props: PROPS) {
//         return (
//           <UseMutation mutation={mutation}>
//             {(mutate, { loading, error, data }) => {
//               const mergedProps: WithMutationProps<NAME, DATA, VARIABLES> = {
//                 [name]: {
//                   execute: mutate,
//                   loading,
//                   error,
//                   data,
//                 },
//               }
//               const nextProps: PROPS &
//                 WithMutationProps<NAME, DATA, VARIABLES> = {
//                 ...props,
//                 ...mergedProps,
//               }
//               return <Component {...nextProps} />
//             }}
//           </UseMutation>
//         )
//       }
//     }
//   }
// }
