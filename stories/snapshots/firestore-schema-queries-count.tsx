import * as React from 'react'
import { build } from '@browserql/firestore'
import gql from 'graphql-tag'
import { print, ASTNode } from 'graphql'
import { firestore } from '../utils'
import { getQuery } from '@browserql/fpql'
import Code from '../components/Code'

export default function FirestoreSchemaQueriesCount() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_count_MyCollection')(schema)
  return (
    <Code
      language="graphql"
      value={`
  extend type Query {
    ${print(query as ASTNode)}
  }
  `}
    />
  )
}
