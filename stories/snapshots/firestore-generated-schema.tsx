import * as React from 'react'
import { build } from '@browserql/firestore'
import gql from 'graphql-tag'
import { print } from 'graphql'
import { firestore } from '../utils'
import { getQuery, getType } from '@browserql/fpql'
import Code from '../components/Code'

export default function FirestoreGeneratedSchema() {
  const { schema } = build(
    firestore,
    gql`
      type Foo {
        name: String!
      }
    `
  )
  return <Code language="graphql" value={print(schema)} />
}
