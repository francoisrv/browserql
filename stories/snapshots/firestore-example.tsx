import * as React from 'react'
import gql from 'graphql-tag'
import { build } from '@browserql/firestore'

export default function FirestoreExample1() {
  const schema = gql`
    type Todo @firestore {
      name: String!
      done: Boolean! @default(value: false)
      doneTime: FirestoreTimestamp
    }
  `

  return <div>hello</div>
}
