import * as React from 'react'
import { build } from '@browserql/firestore'
import gql from 'graphql-tag'
import { print, ASTNode } from 'graphql'
import { firestore } from '../utils'
import { getQuery, getType } from '@browserql/fpql'
import Code from '../components/Code'

export default function FirestoreSchemaQueriesGetMany() {
  const { schema } = build(
    firestore,
    gql`
      type MyCollection @firestore {
        name: String!
      }
    `
  )
  const query = getQuery('firestore_getMany_MyCollection')(schema)
  const p = print(schema)
  // const p = print(query as ASTNode)
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
