import * as React from 'react'
import gql from 'graphql-tag'

import { showCollections } from '@browserql/firestore'

import Code from '../components/Code'

const schema = gql`
  type A @firestore {
    name: String!
  }

  type B @firestore(collection: "collection-b") {
    name: String!
  }
`

export default function FirestoreSchemaShowCollections() {
  return (
    <Code
      language="json"
      value={JSON.stringify(showCollections(schema), null, 2)}
    />
  )
}
