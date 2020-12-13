import * as React from 'react'

import { showCollections } from '@browserql/firestore'

import Code from '../components/Code'

const schema = `
  type A @firestore {
    name: String!
  }

  type B @firestore(collection: "collection-b") {
    name: String!
  }
`

export default function FirestoreSchemaShowCollectionsString() {
  return (
    <Code
      language="json"
      value={JSON.stringify(showCollections(schema), null, 2)}
    />
  )
}
